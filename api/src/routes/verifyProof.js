import express from 'express';
import { verifyZKProof } from '../services/starknetService.js';
import path from 'path';

const router = express.Router();

// Endpoint para verificação de prova ZK usando arquivos do projeto
router.post('/', async (req, res) => {
  try {
    console.log('📥 Recebendo solicitação de verificação ZK...');

    // Usar arquivos padrão do projeto (subir um nível da pasta api)
    const projectRoot = path.join(process.cwd(), '..');
    const proofPath = path.resolve(projectRoot, 'zk-noir-circuit/target/proof_starknet_zk86/proof');
    const vkPath = path.resolve(projectRoot, 'zk-noir-circuit/target/proof_starknet_zk86/vk');
    const publicInputsPath = path.resolve(projectRoot, 'zk-noir-circuit/target/proof_starknet_zk86/public_inputs');

    console.log('📁 Caminhos dos arquivos:', {
      proofPath,
      vkPath,
      publicInputsPath
    });

    // Chamar serviço de verificação com arquivos padrão
    const verificationResult = await verifyZKProof({
      proofPath,
      vkPath,
      publicInputsPath
    });

    console.log('✅ Verificação concluída:', verificationResult);

    res.json({
      success: true,
      message: 'Prova verificada com sucesso',
      result: verificationResult
    });

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
    
    res.status(500).json({
      success: false,
      error: 'Falha na verificação da prova',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint para verificação de prova ZK com caminhos customizados
router.post('/custom', async (req, res) => {
  try {
    console.log('📥 Recebendo solicitação de verificação ZK com caminhos customizados...');

    const { proofPath, vkPath, publicInputsPath } = req.body;

    if (!proofPath || !vkPath || !publicInputsPath) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios ausentes',
        message: 'proofPath, vkPath e publicInputsPath são obrigatórios'
      });
    }

    console.log('📁 Caminhos customizados:', {
      proofPath,
      vkPath,
      publicInputsPath
    });

    // Chamar serviço de verificação com caminhos customizados
    const verificationResult = await verifyZKProof({
      proofPath,
      vkPath,
      publicInputsPath
    });

    console.log('✅ Verificação concluída:', verificationResult);

    res.json({
      success: true,
      message: 'Prova verificada com sucesso',
      result: verificationResult
    });

  } catch (error) {
    console.error('❌ Erro na verificação customizada:', error);
    
    res.status(500).json({
      success: false,
      error: 'Falha na verificação da prova',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint para obter informações sobre o contrato
router.get('/contract-info', (req, res) => {
  res.json({
    success: true,
    contract: {
      address: process.env.CONTRACT_ADDRESS || 'Não configurado',
      network: 'Starknet Sepolia',
      function: 'verify_ultra_starknet_zk_honk_proof',
      status: process.env.CONTRACT_ADDRESS ? 'Configurado' : 'Não configurado'
    }
  });
});

export { router as verifyProofRoute };