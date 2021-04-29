import express from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario';
import Instituicao from '../models/instituicao';
import crypt from '../crypt';
import {
  generateToken,
  generateRefreshToken,
  verifyAuthentication,
} from '../utils/authentication';
import {
  updateUsuario,
  getUsersByInstitution,
  createUser,
  getUserByInstitution,
} from '../controllers/usuario';
import { validatePassword } from '../utils/general';

const router = express.Router();

router.post('/', verifyAuthentication, (req, res) => {
  const create = async () => {
    const { nome, email, pwd, instituicao } = req.body;
    try {
      const user = await Usuario.findOne({ email });
      if (user) {
        throw {
          customError: true,
          status: 404,
          message: 'Usuário já cadastrado',
        };
      }

      const createdUser = await createUser({
        nome,
        email,
        pwd,
        instituicao,
        pwd: crypt.crypt(req.body.pwd),
      });

      res.send(createdUser);
    } catch (error) {
      if (!error.customError) res.status(500).json({ error: 'Erro interno' });
      else {
        const { message, status } = error;
        res.status(status).json({ error: message });
      }
    }
  };
  create();
});

router.put('/', verifyAuthentication, (req, res) => {
  const { email, instituicao } = req.body;
  const associateInstitution = async () => {
    try {
      const user = await Usuario.findOne({ email });
      if (!user) {
        throw {
          customError: true,
          status: 404,
          message: 'Usuário não cadastrado',
        };
      }

      const alreadyAdded = user.instituicoes.includes(instituicao);

      if (alreadyAdded) {
        throw {
          customError: true,
          status: 404,
          message: 'Usuário já pertence a esta instituição',
        };
      }

      const institutionToAdd = Instituicao.findOne({ _id: instituicao });
      if (!institutionToAdd) {
        throw {
          customError: true,
          status: 404,
          message: 'Instituição não existe',
        };
      }

      user.instituicoes.push(instituicao);
      user.save();
      res.send(user);
    } catch (error) {
      if (!error.customError) res.status(500).json({ error: 'Erro interno' });
      else {
        const { message, status } = error;
        res.status(status).json({ error: message });
      }
    }
  };
  associateInstitution();
});

router.put('/:id', verifyAuthentication, (req, res) => {
  const update = async () => {
    try {
      const { id: _id } = req.params;
      const { email, nome, pwd, instituicao } = req.body;
      const user = await getUserByInstitution({ _id }, instituicao, true);
      if (!user) {
        throw {
          customError: true,
          status: 404,
          message: 'Usuário não cadastrado',
        };
      }

      if (nome && user.nome !== nome) user.nome = nome;
      if (pwd) {
        const hashPwd = crypt.crypt(pwd);
        if (user.pwd !== hashPwd) user.pwd = hashPwd;
      }

      const updatedUser = await user.save();
      if (updatedUser.error) {
        if (updatedUser.status === 500)
          res.status(500).json({ error: updatedUser.message });
        if (updatedUser.status === 204) {
          res.statusMessage = updatedUser.message;
          res.status(updatedUser.status).end();
        }
      }
      res.send(updatedUser);
    } catch (error) {
      if (!error.customError) res.status(500).json({ error: 'Erro interno' });
      else {
        const { message, status } = error;
        res.status(status).json({ error: message });
      }
    }
  };

  update();
});

router.post('/login', (req, res) => {
  const email = req.body.email;

  const login = async () => {
    const hashPwd = crypt.crypt(req.body.pwd);
    try {
      const user = await Usuario.findOne({
        email: email,
      })
        .select('+pwd')
        .populate('instituicoes');

      if (user === null || user.length === 0) {
        throw {
          customError: true,
          status: 204,
          message: 'Usuário não encontrado',
        };
      }

      if (user.pwd !== hashPwd)
        throw {
          customError: true,
          status: 204,
          message: 'Senha incorreta',
        };
      user.token = generateToken({ id: user._id });
      user.refreshToken = generateRefreshToken({ id: user._id });
      user.pwd = undefined;

      res.send(user);
    } catch (error) {
      if (!error.customError) res.status(500).json({ error: 'Erro interno' });
      else {
        res.statusMessage = error.message;
        res.status(204).end();
      }
    }
  };
  login();
});

router.post('/refreshToken', (req, res) => {
  const { _id, refreshToken } = req.body;

  const refresh = async () => {
    try {
      if (!refreshToken) throw Error('User not authenticated');
      const user = await Usuario.findOne({ _id }).populate('instituicoes');
      if (user === null || user.length === 0) {
        throw {
          customError: true,
          status: 204,
          message: 'Usuário não encontrado',
        };
      }

      await jwt.verify(refreshToken, process.env.REFRESHSECRET);

      user.token = generateToken({ id: _id });
      user.refreshToken = refreshToken;
      res.send(user);
    } catch (error) {
      if (!err.customError) res.status(500).json({ error: 'Erro interno' });
      else {
        res.statusMessage = err.message;
        res.status(204).end();
      }
    }
  };
  refresh();
});

router.get(
  '/:id/byInstituicao/:instituicao',
  verifyAuthentication,
  (req, res) => {
    const get = async () => {
      try {
        const { id: _id, instituicao } = req.params;
        const user = await getUserByInstitution({ _id }, instituicao);
        if (!user) {
          throw {
            customError: true,
            status: 404,
            message: 'Usuário não cadastrado',
          };
        }
        res.send(user);
      } catch (error) {
        if (!error.customError) res.status(500).json({ error: 'Erro interno' });
        else {
          const { message, status } = error;
          res.status(status).json({ error: message });
        }
      }
    };
    get();
  }
);

router.get('/byInstituicao/:instituicao', verifyAuthentication, (req, res) => {
  const get = async () => {
    try {
      const id = req.params.instituicao || null;
      const users = await getUsersByInstitution(id);
      res.send(users);
    } catch (error) {
      if (!error.customError) res.status(500).json({ error: 'Erro interno' });
      else {
        const { message, status } = error;
        res.status(status).json({ error: message });
      }
    }
  };
  get();
});

router.delete('/:id', verifyAuthentication, (req, res) => {
  const deleteUser = async () => {
    try {
      const _id = req.params.id || null;
      const { instituicao } = req.body;
      const user = await getUserByInstitution({ _id }, instituicao);
      if (user.error) {
        if (user.status === 500) res.status(500).json({ error: user.message });
        if (user.status === 204) {
          res.statusMessage = user.message;
          res.status(user.status).end();
        }
      }
      const err = await Usuario.deleteOne({ _id });

      if (err) {
        if (err.status === 500) res.status(500).json({ error: err.message });
        if (err.status === 204) {
          res.statusMessage = err.message;
          res.status(err.status).end();
        }
      }
      res.send(true);
    } catch (error) {
      if (!error.customError) res.status(500).json({ error: 'Erro interno' });
      else {
        const { message, status } = error;
        res.status(status).json({ error: message });
      }
    }
  };

  deleteUser();
});

router.put('/:id', verifyAuthentication, (req, res) => {
  const update = async () => {
    try {
      const { confirmPwd, ...usuario } = req.body;
      const { id } = req.params;
      if (!validatePassword(usuario.pwd, confirmPwd))
        throw {
          customError: true,
          status: 204,
          message: 'As senha inválida',
        };

      const updatedUser = await updateUsuario(id, usuario);
      if (updatedUser.error) {
        if (updatedUser.status === 500)
          res.status(500).json({ error: updatedUser.message });
        if (updatedUser.status === 204) {
          res.statusMessage = updatedUser.message;
          res.status(updatedUser.status).end();
        }
      }
      res.send(updatedUser);
    } catch (error) {
      if (!error.customError) res.status(500).json({ error: 'Erro interno' });
      else {
        const { message, status } = error;
        res.status(status).json({ error: message });
      }
    }
  };
  update();
});

export default router;
