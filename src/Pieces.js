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

export const piecesImages = {
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

export function getPiece(c) {
  if (c === "") return shovel;
  return piecesImages[c];
}
