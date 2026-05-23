import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Servico { nome: string; preco: string; }
interface Categoria { label: string; servicos: Servico[]; }

@Component({
  selector: 'app-agendamento',
  imports: [CommonModule, FormsModule],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.scss',
})
export class Agendamento {

  // ── Dropdown de serviço ────────────────────────────────────────────────────
  servicoAberto = signal(false);
  servicoSelecionado = signal('');

  // ── Estado do formulário ───────────────────────────────────────────────────
  nome        = '';
  telefone    = '';
  unidade     = '';
  horario     = '';
  data        = '';
  profissional = 'Rafaele Schneider';

  // ── Tela de confirmação ────────────────────────────────────────────────────
  confirmando = signal(false);
  enviado     = signal(false);

  categorias: Categoria[] = [
    {
      label: 'Feminino',
      servicos: [
        { nome: 'Corte de cabelo', preco: 'R$ 45,00' },
        { nome: 'Sobrancelha navalha', preco: 'R$ 15,00' },
        { nome: 'Sobrancelha pinça', preco: 'R$ 45,00' },
        { nome: 'Sobrancelha design henna', preco: 'R$ 50,00' },
        { nome: 'Progressiva', preco: 'a partir R$ 150,00' },
        { nome: 'Luzes / Botox / Hidratação', preco: 'Consulte' },
      ]
    },
    {
      label: 'Masculino e Infantil',
      servicos: [
        { nome: 'Corte tradicional', preco: 'R$ 35,00' },
        { nome: 'Corte navalhado', preco: 'R$ 45,00' },
        { nome: 'Sobrancelha navalha', preco: 'R$ 15,00' },
        { nome: 'Sobrancelha pinça', preco: 'R$ 45,00' },
      ]
    },
    {
      label: 'Unhas e Estética',
      servicos: [
        { nome: 'Manicure básica', preco: 'R$ 35,00' },
        { nome: 'Pedicure básica', preco: 'R$ 45,00' },
        { nome: 'Mãos e pés', preco: 'R$ 70,00' },
        { nome: 'Podologia', preco: 'a partir R$ 150,00' },
        { nome: 'Alongamento gel', preco: 'R$ 120,00' },
        { nome: 'Alongamento fibra', preco: 'R$ 150,00' },
      ]
    },
  ];

  get categoriasFiltradas(): Categoria[] {
    if (this.profissional === 'Adriana (Unhas)') {
      return this.categorias.filter(c => c.label === 'Unhas e Estética');
    }
    return this.categorias.filter(c => c.label !== 'Unhas e Estética');
  }

  trocarProfissional() {
    this.servicoSelecionado.set('');
    this.servicoAberto.set(false);
  }

  toggleServico() { this.servicoAberto.update(v => !v); }

  selecionarServico(nome: string, preco: string) {
    this.servicoSelecionado.set(`${nome} — ${preco}`);
    this.servicoAberto.set(false);
  }

  dataInvalida = false;

  get dataFormatada(): string {
    if (!this.data) return '';
    const [y, m, d] = this.data.split('-');
    return `${d}/${m}/${y}`;
  }

  validarData() {
    if (!this.data) { this.dataInvalida = false; return; }
    const diaSemana = new Date(this.data + 'T12:00:00').getDay();
    if (diaSemana === 0) {
      this.dataInvalida = true;
      this.data = '';
    } else {
      this.dataInvalida = false;
    }
  }

  get formularioValido(): boolean {
    return !!(this.nome.trim() && this.servicoSelecionado() && this.data && this.horario);
  }

  confirmarAgendamento() {
    if (!this.formularioValido) return;
    this.confirmando.set(true);
  }

  cancelarConfirmacao() {
    this.confirmando.set(false);
  }

  enviarWhatsApp() {
    const isAdriana = this.profissional === 'Adriana (Unhas)';
    const destinatario = isAdriana ? 'Adriana' : 'Rafaele';
    const numero = isAdriana ? '5541998685659' : '5541995384543';

    const msg = `Olá ${destinatario}! 👋 Gostaria de confirmar meu agendamento:

*Nome:* ${this.nome}
*Serviço:* ${this.servicoSelecionado()}
*Data:* ${this.dataFormatada}
*Horário:* ${this.horario}${this.unidade ? '\n*Unidade:* ' + this.unidade : ''}${this.telefone ? '\n*Telefone:* ' + this.telefone : ''}

Aguardo confirmação! 😊`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    this.confirmando.set(false);
    this.enviado.set(true);
  }

  novoAgendamento() {
    this.nome = '';
    this.telefone = '';
    this.unidade = '';
    this.horario = '';
    this.data = '';
    this.servicoSelecionado.set('');
    this.enviado.set(false);
  }

  @HostListener('document:click', ['$event'])
  fecharFora(ev: MouseEvent) {
    if (!(ev.target as HTMLElement).closest('.select-custom')) {
      this.servicoAberto.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  fecharEsc() {
    this.servicoAberto.set(false);
    this.confirmando.set(false);
  }
}
