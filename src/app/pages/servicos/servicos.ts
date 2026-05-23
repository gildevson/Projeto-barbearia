import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Servico {
  id: number;
  nome: string;
  preco: string;
  destaque?: boolean;
}

interface Categoria {
  titulo: string;
  icone: string;
  cor: string;
  servicos: Servico[];
  contato?: string;
  imagem?: string;
}

@Component({
  selector: 'app-servicos',
  imports: [RouterLink],
  templateUrl: './servicos.html',
  styleUrl: './servicos.scss',
})
export class Servicos {
  readonly categorias: Categoria[] = [
    {
      titulo: 'Feminino',
      icone: '💇‍♀️',
      cor: '#c9a84c',
      imagem: 'RafaCortabdocablodemulher.png',
      servicos: [
        { id: 1,  nome: 'Corte de cabelo',              preco: 'R$ 45,00' },
        { id: 2,  nome: 'Sobrancelha navalha',          preco: 'R$ 15,00' },
        { id: 3,  nome: 'Sobrancelha pinça',            preco: 'R$ 45,00' },
        { id: 4,  nome: 'Sobrancelha design henna',     preco: 'R$ 50,00' },
        { id: 5,  nome: 'Progressiva a partir de',      preco: 'R$ 150,00', destaque: true },
        { id: 6,  nome: 'Luzes, botox, hidratação e colocação', preco: 'Consulte' },
      ]
    },
    {
      titulo: 'Masculino e Infantil',
      icone: '✂️',
      cor: '#c9a84c',
      imagem: 'MulherCortandoCabelo.png',
      servicos: [
        { id: 7,  nome: 'Corte tradicional',            preco: 'R$ 35,00' },
        { id: 8,  nome: 'Corte navalhado',              preco: 'R$ 45,00' },
        { id: 9,  nome: 'Sobrancelha navalha',          preco: 'R$ 15,00' },
        { id: 10, nome: 'Sobrancelha pinça',            preco: 'R$ 45,00' },
      ]
    },
    {
      titulo: 'Unhas & Estética',
      icone: '💅',
      cor: '#c9a84c',
      imagem: 'Manicure.jpg',
      contato: 'Agendamento com Adriana: (41) 99868-5659',
      servicos: [
        { id: 11, nome: 'Manicure básica',              preco: 'R$ 35,00' },
        { id: 12, nome: 'Pedicure básica',              preco: 'R$ 45,00' },
        { id: 13, nome: 'Mãos e pés',                  preco: 'R$ 70,00' },
        { id: 14, nome: 'Podologia a partir de',        preco: 'R$ 150,00', destaque: true },
        { id: 15, nome: 'Alongamento gel',              preco: 'R$ 120,00' },
        { id: 16, nome: 'Alongamento fibra',            preco: 'R$ 150,00' },
      ]
    },
  ];
}
