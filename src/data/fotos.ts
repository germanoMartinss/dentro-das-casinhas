import type { GalleryPhoto } from "@/types";

/**
 * Fotos da seção "Conheça a Casinha", em /public/images/casinha.
 * O alt descreve o ambiente; se uma foto nova mostrar crianças, descreva a
 * cena sem identificar quem aparece.
 */
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  "Recepção com poltronas de madeira e almofadas, plantas e parede com casinhas pintadas em tons pastel",
  "Sala de integração sensorial com piscina de bolinhas, balanços suspensos, rolos de espuma, bolas e cones coloridos",
  "Sala de integração sensorial com gaiola de suspensão, redes, prancha de equilíbrio, espaldar e cesta de basquete",
  "Sala de atendimento com mesinha infantil, brinquedos de encaixe, armário de madeira e mesa redonda",
  "Espaço de psicomotricidade com estrutura de escalada em madeira, parede de escalada, balanço, minitrampolim e piscina de bolinhas",
  "Sala de atendimento com armário de madeira, banco, mesa redonda branca e cadeiras",
  "Sala de musicalização com teclado, ukulele, xilofone, bola de pilates e mesinha com cadeiras infantis",
  "Sala com estante azul de brinquedos, tambores infantis e quadro com o nome Dentro das Casinhas",
  "Sala ampla com mesinha infantil, mesa redonda com notebook e parede pintada com uma montanha azul",
  "Salão de atividades com mesa coletiva, cadeirinhas, cozinha de brinquedo, escorregador, cercado e árvore decorativa",
  "Sala com mesa coletiva de peças de montar, cadeirinhas, estante de jogos e quadro escrito Ciência ABA",
  "Salão com alfabeto na parede, painéis em forma de casinha, mesa coletiva, cozinha de brinquedo e escorregador",
  "Corredor com parede decorada com árvores em tons pastel e cabideiros feitos de galhos de madeira",
  "Salão com rampa de escalada em madeira, tapete de pista de carrinhos, mesa coletiva e painéis em forma de casinha",
  "Canto de atendimento com mesa redonda, cadeiras pretas e brinquedo de encaixe, diante de parede com montanhas pastel",
  "Sala com mesas que formam um hexágono com jogos de cartas, estante de jogos, quadro branco e mesa com notebook",
  "Sala de reunião com mesa redonda de madeira, cadeiras pretas, armário cinza com impressora e folhas pintadas na parede",
  "Mesinha com livros e jogos infantis, cadeira de madeira e tapete de estampa geométrica",
  "Sala de espera com poltronas e almofadas, planta e parede pintada com casinhas em tons pastel",
  "Espaço de brincar com gramado sintético, golzinho, bola, amarelinha no chão e painel decorativo de polvo",
].map((alt, i) => ({ src: `/images/casinha/${i + 1}.jpg`, alt }));
