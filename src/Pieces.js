import rook from '../img/wR.png';
import knight from '../img/wN.png';
import bishop from '../img/wB.png';
import queen from '../img/wQ.png';
import king from '../img/wK.png';
import pawn from '../img/wP.png';
import blackPawn from '../img/bP.png';
import knook from '../img/knook.png';
import shogiRook from '../img/shogiRook.svg';
import shogiBishop from '../img/shogiBishop.svg';
import shogiKnight from '../img/shogiKnight.svg';
import shogiPawn from '../img/shogiPawn.svg';
import shogiKing from '../img/shogiKing.svg';
import shogiLance from '../img/shogiLance.svg';
import shogiSilverGeneral from '../img/shogiSilverGeneral.svg';
import shogiGoldGeneral from '../img/shogiGoldGeneral.svg';

export const piecesImages = {
  'R': rook,
  'B': bishop,
  'Q': queen,
  'N': knight,
  'P': pawn,
  'K': king,
  'D': blackPawn,
  'O': knook,
  '飛': shogiRook,
  '角': shogiBishop,
  '桂': shogiKnight,
  '歩': shogiPawn,
  '玉': shogiKing,
  '香': shogiLance,
  '銀': shogiSilverGeneral,
  '金': shogiGoldGeneral
}

export function getPiece(c) {
  let image = piecesImages[c];
  return `<img src="${image}"/>`;
}