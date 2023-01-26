import shovel from "./assets/shovel.png";
import rook from "./assets/wR.png";
import knight from "./assets/wN.png";
import bishop from "./assets/wB.png";
import queen from "./assets/wQ.png";
import king from "./assets/wK.png";
import pawn from "./assets/wP.png";
import blackPawn from "./assets/bP.png";
import knook from "./assets/knook.png";
import shogiRook from "./assets/shogiRook.svg";
import shogiBishop from "./assets/shogiBishop.svg";
import shogiKnight from "./assets/shogiKnight.svg";
import shogiPawn from "./assets/shogiPawn.svg";
import shogiKing from "./assets/shogiKing.svg";
import shogiLance from "./assets/shogiLance.svg";
import shogiSilverGeneral from "./assets/shogiSilverGeneral.svg";
import shogiGoldGeneral from "./assets/shogiGoldGeneral.svg";
import plus from "./assets/plus.svg";
import minus from "./assets/minus.svg";

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
