import axios from "axios";
import type { Pokemon, TypeEffectivenessResult } from "../../types/pokemon";

export const getAttackMove = async (
  moves: Pokemon["moves"]
): Promise<string> => {
  const usableMoves = moves.filter(
    (move) => move.version_group_details[0]?.level_learned_at > 0
  );

  for (let i = 0; i < 10; i++) {
    const randomMove =
      usableMoves[Math.floor(Math.random() * usableMoves.length)];
    const moveRes = await axios.get(randomMove.move.url);
    if (moveRes.data.damage_class.name !== "status") {
      return randomMove.move.name;
    }
  }

  return "Struggle";
};

export const simulateTurn = async (
  attacker: Pokemon,
  defender: Pokemon,
  effectivenessObj: TypeEffectivenessResult,
  dispatchLog: (text: string) => void
): Promise<number> => {
  const attackStat =
    attacker.stats.find((s) => s.stat.name === "attack")?.base_stat || 50;
  const defenseStat =
    defender.stats.find((s) => s.stat.name === "defense")?.base_stat || 50;
  const accuracy =
    attacker.stats.find((s) => s.stat.name === "speed")?.base_stat || 50;

  const move = await getAttackMove(attacker.moves);
  const hitChance = Math.random() * 100;
  const hit = hitChance < accuracy;

  let damage = 0;
  if (hit) {
    damage = Math.max(
      1,
      Math.floor(
        attackStat * effectivenessObj.multiplier -
          defenseStat * 0.3 +
          Math.random() * 10
      )
    );
  }

  let log = `${attacker.name} used ${move}`;
  if (hit) {
    log += ` and dealt ${damage} damage!`;
    if (effectivenessObj.isSuperEffective) log += " It's super effective!";
  } else {
    log += " but missed!";
  }

  dispatchLog(log);
  return hit ? damage : 0;
};
