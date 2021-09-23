import express from 'express';
import {
  getFamilyByInstitution,
  getFamiliesByInstitution,
  updateFamily,
  createFamily,
} from '../controllers/familia';
import Familia from '../models/familia';
import { getNextMonth } from '../utils/family';
import { verifyAuthentication, bigDawg } from '../utils/authentication';
const router = express.Router();

router.get('/', bigDawg, (req, res) => {
  const get = async () => {
    try {
      const families = await Familia.find().sort({ id: 1 });
      res.send(families);
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

router.get('/byInstitution/:instituicao', verifyAuthentication, (req, res) => {
  const get = async () => {
    try {
      const { instituicao } = req.params;
      const families = await getFamiliesByInstitution(instituicao);
      res.send(families);
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

router.get('/:id/:instituicao', verifyAuthentication, (req, res) => {
  const get = async () => {
    try {
      const { id: _id, instituicao } = req.params;
      const family = await getFamilyByInstitution({ _id }, instituicao);
      if (!family) {
        throw {
          customError: true,
          status: 404,
          message: 'Família não cadastrada',
        };
      }
      res.send(family);
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

router.post('/', verifyAuthentication, (req, res) => {
  const create = async () => {
    const toBeCreated = req.body;
    const { instituicao, id } = toBeCreated;
    try {
      const family = await Familia.findOne({ id, instituicao });
      if (family) {
        throw {
          customError: true,
          status: 404,
          message: 'Família já cadastrada',
        };
      }

      const createdFamily = await createFamily(toBeCreated);

      res.send(createdFamily);
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

router.put('/:id', verifyAuthentication, (req, res) => {
  const update = async () => {
    try {
      const { id: _id } = req.params;
      const family = req.body;

      const updatedFamily = await updateFamily({ _id, ...family });
      res.send(updatedFamily);
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

router.put('/:id/:instituicao/addMonth',bigDawg, (req, res) => {
  const update = async () => {
    try {      
      const { id: _id, instituicao } = req.params;
      const family = await getFamilyByInstitution({ _id }, instituicao);      
      if (!family) {
        throw {
          customError: true,
          status: 404,
          message: 'Família não cadastrada',
        };
      }

      const nextMonth = getNextMonth(family);
      family.cronograma.push(nextMonth);
      family.tempoAtendimento++;

      const updatedFamily = await updateFamily({ _id, ...family });      
      res.send(updatedFamily);
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

router.delete('/:id', bigDawg, (req, res) => {
  const deleteFamily = async () => {
    try {
      const { id: _id } = req.params;
      const { instituicao } = req.body;
      const family = await getFamilyByInstitution({ _id }, instituicao);
      if (family.error) {
        if (family.status === 500)
          res.status(500).json({ error: family.message });
        if (family.status === 204) {
          res.statusMessage = family.message;
          res.status(family.status).end();
        }
      }
      const err = await Familia.deleteOne({ _id });

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

  deleteFamily();
});

export default router;
