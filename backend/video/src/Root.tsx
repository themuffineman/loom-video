import "./index.css";
import { Composition, getInputProps } from "remotion";
import { Main } from "./Main";
import { parseMedia } from "@remotion/media-parser";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  const props: { screen: string; face: string } = getInputProps();
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        defaultProps={props}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1200}
        calculateMetadata={async ({ props }) => {
          const { slowDurationInSeconds } = await parseMedia({
            src: props.face,
            fields: { slowDurationInSeconds: true },
          });

          return {
            durationInFrames: Math.floor(slowDurationInSeconds * 30),
          };
        }}
      />
    </>
  );
};
