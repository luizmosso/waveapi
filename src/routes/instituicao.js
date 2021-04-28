import express from 'express';
import Instituicao from '../models/instituicao';
import {
  getInstituicoes,
  getInstituicoesByUser,
  updateInstituicao,
  createInstituicao,
} from '../controllers/instituicao';
import { verifyAuthentication, bigDawg } from '../utils/authentication';
const router = express.Router();

router.get('/', (req, res) => {
  const get = async () => {
    try {
      const institutions = await getInstituicoes();
      res.send(institutions);
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

router.post('/', bigDawg, (req, res) => {
  const create = async () => {
    const {
      nome,
      endereco,
      bairro,
      cidade,
      telefone,
      responsavel,
      image,
    } = req.body;
    try {
      const instituicao = await Instituicao.findOne({ nome });
      if (instituicao) {
        throw {
          customError: true,
          status: 404,
          message: 'Instituicao com mesmo nome, já cadastrada',
        };
      }

      const createdInstitution = await createInstituicao({
        nome,
        endereco,
        bairro,
        cidade,
        telefone,
        responsavel,
        image,
      });

      res.send(createdInstitution);
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

router.get('/byUser/:id', verifyAuthentication, (req, res) => {
  const get = async () => {
    const id = req.params.id || null;
    const instituicoes = await getInstituicoesByUser(id);
    if (instituicoes.error) {
      if (instituicoes.status === 500)
        res.status(500).json({ error: instituicoes.message });
      if (instituicoes.status === 204) {
        res.statusMessage = instituicoes.message;
        res.status(instituicoes.status).end();
      }
    }
    res.send(instituicoes);
  };
  get();
});

router.put('/:id', verifyAuthentication, (req, res) => {
  const update = async () => {
    const instituicao = req.body;
    const { id } = req.params;
    const updatedInstitution = await updateInstituicao(id, instituicao);
    if (updatedInstitution.error) {
      if (updatedInstitution.status === 500)
        res.status(500).json({ error: updatedInstitution.message });
      if (updatedInstitution.status === 204) {
        res.statusMessage = updatedInstitution.message;
        res.status(updatedInstitution.status).end();
      }
    }
    res.send(updatedInstitution);
  };
  update();
});

export default router;
