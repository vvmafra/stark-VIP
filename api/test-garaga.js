#!/usr/bin/env node

/**
 * Script de teste para verificar se o Garaga CLI está funcionando
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

async function testGaraga() {
  try {
    console.log('🧪 Testando Garaga CLI...\n');

    // 1. Verificar se o Garaga CLI está instalado
    console.log('1️⃣ Verificando instalação do Garaga CLI...');
    try {
      const { stdout } = await execAsync('garaga --version');
      console.log('✅ Garaga CLI instalado:', stdout.trim());
    } catch (error) {
      console.error('❌ Garaga CLI não encontrado. Instale com: cargo install garaga');
      return;
    }

    // 2. Verificar arquivos necessários
    console.log('\n2️⃣ Verificando arquivos necessários...');
    const fs = await import('fs');
    
    const proofPath = path.resolve('zk-noir-circuit/target/proof_starknet_zk86/proof');
    const vkPath = path.resolve('zk-noir-circuit/target/proof_starknet_zk86/vk');
    const publicInputsPath = path.resolve('zk-noir-circuit/target/proof_starknet_zk86/public_inputs');

    console.log('📁 Caminhos dos arquivos:');
    console.log(`   - Proof: ${proofPath}`);
    console.log(`   - VK: ${vkPath}`);
    console.log(`   - Public Inputs: ${publicInputsPath}`);

    if (!fs.existsSync(proofPath)) {
      console.error('❌ Arquivo de prova não encontrado');
      return;
    }
    if (!fs.existsSync(vkPath)) {
      console.error('❌ Arquivo de VK não encontrado');
      return;
    }
    if (!fs.existsSync(publicInputsPath)) {
      console.error('❌ Arquivo de public inputs não encontrado');
      return;
    }

    console.log('✅ Todos os arquivos encontrados');

    // 3. Testar comando do Garaga CLI
    console.log('\n3️⃣ Testando comando do Garaga CLI...');
    
    // Usar caminhos relativos
    const relativeProofPath = path.relative(process.cwd(), proofPath);
    const relativeVkPath = path.relative(process.cwd(), vkPath);
    const relativePublicInputsPath = path.relative(process.cwd(), publicInputsPath);

    console.log('📁 Caminhos relativos:');
    console.log(`   - Proof: ${relativeProofPath}`);
    console.log(`   - VK: ${relativeVkPath}`);
    console.log(`   - Public Inputs: ${relativePublicInputsPath}`);

    const command = `garaga calldata --system ultra_starknet_zk_honk --proof "${relativeProofPath}" --vk "${relativeVkPath}" --public-inputs "${relativePublicInputsPath}"`;
    
    console.log('\n📝 Executando comando:');
    console.log(command);

    try {
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr) {
        console.warn('⚠️ Avisos do Garaga CLI:', stderr);
      }
      
      console.log('\n✅ Comando executado com sucesso!');
      console.log('📊 Tamanho do calldata:', stdout.split(' ').length, 'elementos');
      console.log('📋 Primeiros 10 elementos:', stdout.split(' ').slice(0, 10));
      
    } catch (error) {
      console.error('\n❌ Erro ao executar comando:', error.message);
      console.error('📋 Detalhes do erro:', error.stderr);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar teste se este arquivo for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testGaraga();
}

export { testGaraga };
