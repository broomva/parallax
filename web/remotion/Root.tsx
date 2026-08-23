import { Composition } from "remotion";
import { AcceptGate, ACCEPT_GATE_DURATION } from "./comps/AcceptGate";
import { ForkDiverge, FORK_DURATION } from "./comps/ForkDiverge";
import { OperatorLoop, OPERATOR_LOOP_DURATION } from "./comps/OperatorLoop";
import { Provenance, PROVENANCE_DURATION } from "./comps/Provenance";
import { ReplayHash, REPLAY_DURATION } from "./comps/ReplayHash";
import { FPS, H, W } from "./kit";

/**
 * The same four compositions the landing page mounts in a <Player>. This entry
 * exists so `bun run studio` can open them and `bun run still` can render a
 * frame out for a social card or the README, from one source rather than two.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AcceptGate"
      component={AcceptGate}
      durationInFrames={ACCEPT_GATE_DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="ForkDiverge"
      component={ForkDiverge}
      durationInFrames={FORK_DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="OperatorLoop"
      component={OperatorLoop}
      durationInFrames={OPERATOR_LOOP_DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="Provenance"
      component={Provenance}
      durationInFrames={PROVENANCE_DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="ReplayHash"
      component={ReplayHash}
      durationInFrames={REPLAY_DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
