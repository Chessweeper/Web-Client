import shovel from "./assets/img/shovel.png";
import rook from "./assets/img/wR.png";
import knight from "./assets/img/wN.png";
import bishop from "./assets/img/wB.png";
import queen from "./assets/img/wQ.png";
import king from "./assets/img/wK.png";
import pawn from "./assets/img/wP.png";
import blackPawn from "./assets/img/bP.png";
import knook from "./assets/img/knook.png";
import shogiRook from "./assets/img/shogiRook.svg";
import shogiBishop from "./assets/img/shogiBishop.svg";
import shogiKnight from "./assets/img/shogiKnight.svg";
import shogiPawn from "./assets/img/shogiPawn.svg";
import shogiKing from "./assets/img/shogiKing.svg";
import shogiLance from "./assets/img/shogiLance.svg";
import shogiSilverGeneral from "./assets/img/shogiSilverGeneral.svg";
import shogiGoldGeneral from "./assets/img/shogiGoldGeneral.svg";
import plus from "./assets/img/plus.svg";
import minus from "./assets/img/minus.svg";

// todo: union type for pieces?
export const piecesImages: Record<string, string> = {
  R: rook,
  B: bishop,
  Q: queen,
  N: knight,
  P: pawn,
  K: king,
  D: blackPawn,
  O: knook,
  飛: shogiRook,
  角: shogiBishop,
  桂: shogiKnight,
  歩: shogiPawn,
  玉: shogiKing,
  香: shogiLance,
  銀: shogiSilverGeneral,
  金: shogiGoldGeneral,
};

export function getPiece(c: string) {
  if (c === "shovel") return shovel;
  if (c === "plus") return plus;
  if (c === "minus") return minus;
  return piecesImages[c];
}
