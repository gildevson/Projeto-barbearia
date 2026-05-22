import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Servico { nome: string; preco: string; }
interface Categoria { label: string; servicos: Servico[]; }

@Component({
  selector: 'app-agendamento',
  imports: [CommonModule],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.scss',
})
export class Agendamento {
  servicoAberto = signal(false);
  servicoSelecionado = signal('');

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

  toggleServico() { this.servicoAberto.update(v => !v); }

  selecionarServico(nome: string, preco: string) {
    this.servicoSelecionado.set(`${nome} — ${preco}`);
    this.servicoAberto.set(false);
  }

  @HostListener('document:click', ['$event'])
  fecharFora(ev: MouseEvent) {
    if (!(ev.target as HTMLElement).closest('.select-custom')) {
      this.servicoAberto.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  fecharEsc() { this.servicoAberto.set(false); }
}
