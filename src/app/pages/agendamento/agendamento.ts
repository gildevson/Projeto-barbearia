import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Após implantar o Apps Script, substitua a URL abaixo
const SCRIPT_URL_RAFAELE = 'COLE_A_URL_DO_APPS_SCRIPT_AQUI';

interface Servico { nome: string; preco: string; duracao: number; }
interface Categoria { label: string; servicos: Servico[]; }

@Component({
  selector: 'app-agendamento',
  imports: [CommonModule, FormsModule],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.scss',
})
export class Agendamento {

  // ── Dropdown de serviço (multi-seleção) ───────────────────────────────────
  servicoAberto       = signal(false);
  servicosSelecionados = signal<Servico[]>([]);

  // ── Estado do formulário ───────────────────────────────────────────────────
  nome         = '';
  telefone     = '';
  unidade      = '';
  horario      = '';
  data         = '';
  profissional = 'Rafaele Schneider';

  // ── Tela de confirmação ────────────────────────────────────────────────────
  confirmando = signal(false);
  enviado     = signal(false);

  // ── Catálogo de serviços ───────────────────────────────────────────────────
  // Para adicionar um serviço: inclua { nome, preco, duracao } na categoria correta.
  categorias: Categoria[] = [
    {
      label: 'Feminino',
      servicos: [
        { nome: 'Corte de cabelo',           preco: 'R$ 45,00',           duracao: 45  },
        { nome: 'Sobrancelha navalha',        preco: 'R$ 15,00',           duracao: 20  },
        { nome: 'Sobrancelha pinça',          preco: 'R$ 45,00',           duracao: 30  },
        { nome: 'Sobrancelha design henna',   preco: 'R$ 50,00',           duracao: 45  },
        { nome: 'Progressiva',                preco: 'a partir R$ 150,00', duracao: 180 },
        { nome: 'Luzes / Botox / Hidratação', preco: 'Consulte',           duracao: 150 },
      ]
    },
    {
      label: 'Masculino e Infantil',
      servicos: [
        { nome: 'Corte tradicional',   preco: 'R$ 35,00', duracao: 30 },
        { nome: 'Corte navalhado',     preco: 'R$ 45,00', duracao: 45 },
        { nome: 'Sobrancelha navalha', preco: 'R$ 15,00', duracao: 20 },
        { nome: 'Sobrancelha pinça',   preco: 'R$ 45,00', duracao: 30 },
      ]
    },
    {
      label: 'Unhas e Estética',
      servicos: [
        { nome: 'Manicure básica',   preco: 'R$ 35,00',           duracao: 60  },
        { nome: 'Pedicure básica',   preco: 'R$ 45,00',           duracao: 60  },
        { nome: 'Mãos e pés',        preco: 'R$ 70,00',           duracao: 90  },
        { nome: 'Podologia',         preco: 'a partir R$ 150,00', duracao: 90  },
        { nome: 'Alongamento gel',   preco: 'R$ 120,00',          duracao: 120 },
        { nome: 'Alongamento fibra', preco: 'R$ 150,00',          duracao: 120 },
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
    this.servicosSelecionados.set([]);
    this.servicoAberto.set(false);
  }

  toggleServico() { this.servicoAberto.update(v => !v); }

  estaSelecionado(nome: string): boolean {
    return this.servicosSelecionados().some(s => s.nome === nome);
  }

  toggleServicoItem(servico: Servico) {
    const atual = this.servicosSelecionados();
    const idx = atual.findIndex(s => s.nome === servico.nome);
    if (idx >= 0) {
      this.servicosSelecionados.set(atual.filter((_, i) => i !== idx));
    } else {
      this.servicosSelecionados.set([...atual, servico]);
    }
    // mantém o dropdown aberto para selecionar mais serviços
  }

  get duracaoTotal(): number {
    return this.servicosSelecionados().reduce((sum, s) => sum + s.duracao, 0);
  }

  formatarDuracao(min: number): string {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}min`;
  }

  get duracaoTexto(): string {
    return this.formatarDuracao(this.duracaoTotal);
  }

  // Texto exibido no botão trigger do dropdown
  get servicoDisplay(): string {
    const sel = this.servicosSelecionados();
    if (sel.length === 0) return '';
    if (sel.length === 1) return `${sel[0].nome} — ${sel[0].preco}`;
    return `${sel.length} serviços — ${this.duracaoTexto} total`;
  }

  dataInvalida = false;

  get dataMinima(): string {
    const hoje = new Date();
    const y = hoje.getFullYear();
    const m = String(hoje.getMonth() + 1).padStart(2, '0');
    const d = String(hoje.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  get horariosDisponiveis(): string[] {
    const slots: string[] = [];
    for (let h = 8; h <= 21; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 21 && m > 0) break;
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }

    if (!this.data) return slots;

    const hoje = new Date();
    const selecionada = new Date(this.data + 'T12:00:00');
    const isHoje =
      selecionada.getFullYear() === hoje.getFullYear() &&
      selecionada.getMonth()    === hoje.getMonth()    &&
      selecionada.getDate()     === hoje.getDate();

    if (!isHoje) return slots;

    const agoraMin = hoje.getHours() * 60 + hoje.getMinutes();
    return slots.filter(slot => {
      const [h, m] = slot.split(':').map(Number);
      return h * 60 + m > agoraMin;
    });
  }

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
      this.horario = '';
    } else {
      this.dataInvalida = false;
      // limpa horário se o selecionado ficou no passado ao trocar para hoje
      if (this.horario && !this.horariosDisponiveis.includes(this.horario)) {
        this.horario = '';
      }
    }
  }

  get formularioValido(): boolean {
    return !!(this.nome.trim() && this.servicosSelecionados().length > 0 && this.data && this.horario);
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
    const totalInicioMin = parseInt(this.horario.split(':')[0]) * 60 + parseInt(this.horario.split(':')[1]);
    const totalFimMin    = totalInicioMin + (this.duracaoTotal || 60);
    const inicioStr = `${y}${m}${d}T${this.horario.replace(':', '')}00`;
    const fimH   = String(Math.floor(totalFimMin / 60)).padStart(2, '0');
    const fimMin = String(totalFimMin % 60).padStart(2, '0');
    const fimStr = `${y}${m}${d}T${fimH}${fimMin}00`;

    const nomes  = this.servicosSelecionados().map(s => s.nome).join(' + ');
    const titulo = encodeURIComponent(`[PENDENTE] ${nomes} - ${this.nome}`);
    const local  = encodeURIComponent(this.unidade || 'Rafa Barbershop - Curitiba');
    const linhasServicos = this.servicosSelecionados()
      .map(s => `- ${s.nome} (${this.formatarDuracao(s.duracao)})`)
      .join('\n');
    const detalhe = encodeURIComponent(
      `Cliente: ${this.nome}` +
      (this.telefone ? `\nTelefone: ${this.telefone}` : '') +
      `\n\nServicos:\n${linhasServicos}` +
      `\nDuracao total: ${this.duracaoTexto}` +
      `\n\nAguardando confirmacao.`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${inicioStr}/${fimStr}&location=${local}&details=${detalhe}`;
  }

  private salvarNaAgenda(): void {
    if (!SCRIPT_URL_RAFAELE || SCRIPT_URL_RAFAELE.startsWith('COLE_')) return;
    fetch(SCRIPT_URL_RAFAELE, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        nome:     this.nome,
        servico:  this.servicosSelecionados().map(s => s.nome).join(', '),
        data:     this.dataFormatada,
        horario:  this.horario,
        duracao:  this.duracaoTotal,
        telefone: this.telefone,
        unidade:  this.unidade
      })
    }).catch(() => {});
  }

  enviarWhatsApp() {
    const isAdriana = this.profissional === 'Adriana (Unhas)';
    const destinatario = isAdriana ? 'Adriana' : 'Rafaele';
    const numero = isAdriana ? '5541998685659' : '5541995384543';

    const linhasServicos = this.servicosSelecionados()
      .map(s => `- ${s.nome} — ${s.preco} (${this.formatarDuracao(s.duracao)})`)
      .join('\n');

    const linkAgenda = this.gerarLinkAgenda();
    const msg = `Ola ${destinatario}! Gostaria de confirmar meu agendamento na *Rafa Barbershop* :)

*Nome:* ${this.nome}
*Servicos:*
${linhasServicos}
*Duracao total:* ${this.duracaoTexto}
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
    this.servicosSelecionados.set([]);
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
