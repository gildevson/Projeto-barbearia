import { Component, signal, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Avaliacao {
  nome: string;
  data: string;
  estrelas: number;
  texto: string;
  foto: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly estrelas = [1, 2, 3, 4, 5];

  imgAberta = signal<string | null>(null);

  abrirFoto(ev: MouseEvent) {
    const img = (ev.target as HTMLElement)
      .closest('.portfolio-item')
      ?.querySelector('img.portfolio-foto') as HTMLImageElement | null;
    if (img?.src) this.imgAberta.set(img.src);
  }

  fecharFoto() { this.imgAberta.set(null); }

  @HostListener('document:keydown.escape')
  onEsc() { this.fecharFoto(); }


  readonly avaliacoes: Avaliacao[] = [
    { nome: 'Lucas Almeida',  data: 'Maio 2025',     estrelas: 5, foto: 'https://randomuser.me/api/portraits/men/32.jpg',  texto: 'Melhor barbearia de Curitiba! A Rafaela tem uma habilidade incrível, saí com o corte perfeito. Atendimento nota 10!' },
    { nome: 'Pedro Souza',    data: 'Abril 2025',    estrelas: 5, foto: 'https://randomuser.me/api/portraits/men/45.jpg',  texto: 'Levo meu filho desde pequeno e ele adora. A Rafa tem muita paciência com as crianças. Recomendo demais!' },
    { nome: 'Carlos Mendes',  data: 'Abril 2025',    estrelas: 5, foto: 'https://randomuser.me/api/portraits/men/17.jpg',  texto: 'Corte e barba impecáveis. Ambiente super agradável e profissional. Com certeza voltarei!' },
    { nome: 'Rafael Lima',    data: 'Março 2025',    estrelas: 5, foto: 'https://randomuser.me/api/portraits/men/58.jpg',  texto: 'A Rafaela é simplesmente a melhor! 10 anos de experiência fazem toda a diferença. Meu cabelo nunca ficou tão bem.' },
    { nome: 'Bruno Costa',    data: 'Março 2025',    estrelas: 5, foto: 'https://randomuser.me/api/portraits/men/23.jpg',  texto: 'Serviço de altíssima qualidade. Fui pela primeira vez e já agendei o próximo. Valeu muito a pena!' },
    { nome: 'Mateus Rocha',   data: 'Fevereiro 2025',estrelas: 5, foto: 'https://randomuser.me/api/portraits/men/71.jpg',  texto: 'Ótimo ambiente, profissional dedicada e resultado incrível. Nunca mais vou a outra barbearia!' },
    { nome: 'Diego Ferreira', data: 'Maio 2025',     estrelas: 5, foto: 'https://randomuser.me/api/portraits/men/38.jpg',  texto: 'Levo meus dois filhos para cortar com a Rafaela todo mês. Eles adoram! Ela tem uma paciência incrível com crianças e o resultado é sempre impecável. Virou tradição da família!' },
    { nome: 'Anderson Luz',   data: 'Abril 2025',    estrelas: 5, foto: 'https://randomuser.me/api/portraits/men/55.jpg',  texto: 'A Rafa corta meu cabelo há mais de 6 anos. Profissional que realmente entende de estilo — ela conhece cada detalhe do meu cabelo e sempre entrega o resultado certo. Experiência que poucos têm!' },
    { nome: 'Thiago Neves',   data: 'Março 2025',    estrelas: 5, foto: 'https://randomuser.me/api/portraits/men/14.jpg',  texto: 'Saí com a autoestima lá em cima! Um corte bem feito transforma a pessoa por completo. A Rafaela tem um estilo único, sabe exatamente o que combina com cada rosto. Me sinto muito mais confiante depois de cada visita!' },
  ];
}
