import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Após implantar o Apps Script, substitua a URL abaixo
const SCRIPT_URL_RAFAELE = 'COLE_A_URL_DO_APPS_SCRIPT_AQUI';

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

  private gerarLinkAgenda(): string {
    const [d, m, y] = this.dataFormatada.split('/');
    const [h, min] = this.horario.split(':');
    const fimH = String(parseInt(h) + 1).padStart(2, '0');
    const inicio = `${y}${m}${d}T${h}${min}00`;
    const fim    = `${y}${m}${d}T${fimH}${min}00`;

    const titulo  = encodeURIComponent(`[PENDENTE] ${this.servicoSelecionado()} - ${this.nome}`);
    const local   = encodeURIComponent(this.unidade || 'Rafa Barbershop - Curitiba');
    const detalhe = encodeURIComponent(
      `Cliente: ${this.nome}` +
      (this.telefone ? `\nTelefone: ${this.telefone}` : '') +
      `\n\nAguardando confirmacao.`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${inicio}/${fim}&location=${local}&details=${detalhe}`;
  }

  private salvarNaAgenda(): void {
    if (!SCRIPT_URL_RAFAELE || SCRIPT_URL_RAFAELE.startsWith('COLE_')) return;
    fetch(SCRIPT_URL_RAFAELE, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        nome:     this.nome,
        servico:  this.servicoSelecionado(),
        data:     this.dataFormatada,
        horario:  this.horario,
        telefone: this.telefone,
        unidade:  this.unidade
      })
    }).catch(() => { /* WhatsApp é o canal principal; agenda é best-effort */ });
  }

  enviarWhatsApp() {
    const isAdriana = this.profissional === 'Adriana (Unhas)';
    const destinatario = isAdriana ? 'Adriana' : 'Rafaele';
    const numero = isAdriana ? '5541998685659' : '5541995384543';

    const linkAgenda = this.gerarLinkAgenda();
    const msg = `Ola ${destinatario}! Gostaria de confirmar meu agendamento na *Rafa Barbershop* :)

*Nome:* ${this.nome}
*Servico:* ${this.servicoSelecionado()}
*Data:* ${this.dataFormatada}
*Horario:* ${this.horario}${this.unidade ? '\n*Unidade:* ' + this.unidade : ''}${this.telefone ? '\n*Telefone:* ' + this.telefone : ''}

*Ver na agenda:* ${linkAgenda}

Aguardo confirmacao!`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    this.confirmando.set(false);
    this.enviado.set(true);
    this.salvarNaAgenda();
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
