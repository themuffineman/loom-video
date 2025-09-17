import {
  AbsoluteFill,
  OffthreadVideo,
  // staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Manrope";
const { fontFamily } = loadFont();

export const Main: React.FC<{ screen: string; face: string }> = ({
  face,
  screen,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <VideoEmbed face={face} screen={screen} />
    </AbsoluteFill>
  );
};

const VideoEmbed: React.FC<{ screen: string; face: string }> = ({
  face,
  screen,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const seconds = Math.floor(frame / fps);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = String(seconds % 60).padStart(2, "0");
  const displayMinutes = String(minutes).padStart(2, "0");
  return (
    <div className="w-full h-full bg-white relative">
      <OffthreadVideo delayRenderTimeoutInMilliseconds={60000} src={screen} />
      <div className="absolute overflow-hidden size-[400px] rounded-full bottom-5 left-5">
        <OffthreadVideo
          delayRenderTimeoutInMilliseconds={60000}
          className=" size-full rounded-full object-cover"
          src={face}
        />
      </div>
      <div className="flex items-center scale-[2] p-2 px-4 shadow-2xl gap-2 absolute bottom-[200px] left-[680px] bg-white rounded-full border w-max">
        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            data-src="chrome-extension://kbbdabhdfibnancpjfhlkhafgdilcnji/assets/tool-icons/grab-icon.svg"
            role="img"
          >
            <rect
              width="3"
              height="3"
              x="4"
              y="3.48"
              fill="#9797A4"
              rx="1.5"
            ></rect>
            <rect
              width="3"
              height="3"
              x="10"
              y="3.48"
              fill="#9797A4"
              rx="1.5"
            ></rect>
            <rect
              width="3"
              height="3"
              x="4"
              y="9.48"
              fill="#9797A4"
              rx="1.5"
            ></rect>
            <rect
              width="3"
              height="3"
              x="10"
              y="9.48"
              fill="#9797A4"
              rx="1.5"
            ></rect>
          </svg>
        </div>
        <div className="p-2 bg-[#F6F7FB] px-3 rounded-full flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            data-src="chrome-extension://kbbdabhdfibnancpjfhlkhafgdilcnji/assets/tool-icons/stop-icon.svg"
            role="img"
          >
            <g clip-path="url(#clip0_574_941-1)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM6.33203 5.33398H9.66536C10.2176 5.33398 10.6654 5.7817 10.6654 6.33398V9.66732C10.6654 10.2196 10.2176 10.6673 9.66537 10.6673H6.33203C5.77975 10.6673 5.33203 10.2196 5.33203 9.66732V6.33399C5.33203 5.7817 5.77975 5.33398 6.33203 5.33398Z"
                fill="#29292F"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_574_941-1">
                <rect width="16" height="16" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
          <p style={{ fontFamily }} className="text-[#C7C7CF] font-bold">
            {displayMinutes}:{displaySeconds}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            data-src="chrome-extension://kbbdabhdfibnancpjfhlkhafgdilcnji/assets/tool-icons/restart-icon.svg"
            role="img"
          >
            <g clip-path="url(#a-2)">
              <path
                stroke="#C7C7CF"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M.668 2.666v4h4"
              ></path>
              <path
                stroke="#C7C7CF"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.341 10a6 6 0 1 0 1.42-6.24L.668 6.666"
              ></path>
            </g>
            <defs>
              <clipPath id="a-2">
                <path fill="#fff" d="M0 0h16v16H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            data-src="chrome-extension://kbbdabhdfibnancpjfhlkhafgdilcnji/assets/tool-icons/pause-icon.svg"
            role="img"
          >
            <path
              stroke="#C7C7CF"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M4.922 13.538V2.46m6.156 11.078V2.46"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            data-src="chrome-extension://kbbdabhdfibnancpjfhlkhafgdilcnji/assets/tool-icons/discard-icon.svg"
            role="img"
          >
            <path
              stroke="#C7C7CF"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2 4.586h11.52m-8.319 0V3.293a1.3 1.3 0 0 1 .375-.914c.24-.243.566-.379.905-.379h2.56c.34 0 .665.136.905.379a1.3 1.3 0 0 1 .375.914v1.293m1.92 0v9.05a1.3 1.3 0 0 1-.375.915c-.24.242-.565.378-.905.378h-6.4c-.34 0-.665-.136-.905-.378a1.3 1.3 0 0 1-.375-.915v-9.05h8.96ZM6.48 7.818v3.88m2.563-3.88v3.88"
            ></path>
          </svg>
        </div>
        <div className="w-2 h-[70%] bg-[#C7C7CF]" />
        <div className="flex stroke-[#9797A4] items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            data-src="chrome-extension://kbbdabhdfibnancpjfhlkhafgdilcnji/assets/tool-icons/draw-icon.svg"
            role="img"
          >
            <g clip-path="url(#a-11)">
              <path
                stroke="#9797A4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11.332 2a1.886 1.886 0 0 1 2.667 2.666l-9 9-3.667 1 1-3.667 9-9Z"
              ></path>
            </g>
            <defs>
              <clipPath id="a-11">
                <path fill="#fff" d="M0 0h16v16H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#9797A4"
            stroke="#9797A4"
            viewBox="0 0 16 16"
            data-src="chrome-extension://kbbdabhdfibnancpjfhlkhafgdilcnji/assets/tool-icons/blur-icon.svg"
            role="img"
          >
            <circle cx="9.865" cy="6.132" r="1.4"></circle>
            <circle cx="6.134" cy="6.132" r="1.4"></circle>
            <circle cx="10.032" cy="1.903" r=".903"></circle>
            <circle cx="5.97" cy="1.903" r=".903"></circle>
            <circle cx="9.865" cy="9.867" r="1.4"></circle>
            <circle cx="14.098" cy="5.968" r=".903"></circle>
            <circle cx="14.098" cy="10.032" r=".903"></circle>
            <circle cx="6.134" cy="9.867" r="1.4"></circle>
            <circle cx="10.032" cy="14.097" r=".903"></circle>
            <circle cx="5.97" cy="14.097" r=".903"></circle>
            <circle cx="1.903" cy="5.968" r=".903"></circle>
            <circle cx="1.903" cy="10.032" r=".903"></circle>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="17"
            fill="none"
            viewBox="0 0 16 17"
            data-src="chrome-extension://kbbdabhdfibnancpjfhlkhafgdilcnji/assets/tool-icons/cursor-icon.svg"
            role="img"
          >
            <path
              stroke="#9797A4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m2 2.52 4.713 11.313 1.674-4.927 4.926-1.673L2 2.52Zm6.668 6.666 4 4"
            ></path>
          </svg>
        </div>
        <div className="w-1 h-[90%]" />
        <div className="flex bg-[#F1F9F1] rounded-full p-2 size-max items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            data-src="chrome-extension://kbbdabhdfibnancpjfhlkhafgdilcnji/assets/tool-icons/mic-icon.svg"
            role="img"
          >
            <path
              stroke="#78C072"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.334 1.334c-.505 0-.99.192-1.346.533a1.777 1.777 0 0 0-.558 1.285v4.849c0 .482.2.944.558 1.285a1.95 1.95 0 0 0 1.346.533c.506 0 .99-.192 1.347-.533.358-.34.558-.803.558-1.285V3.152c0-.482-.2-.945-.558-1.285a1.952 1.952 0 0 0-1.347-.533v0Z"
            ></path>
            <path
              stroke="#78C072"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12.78 6.787V8a4.147 4.147 0 0 1-1.302 3 4.554 4.554 0 0 1-3.143 1.243A4.554 4.554 0 0 1 5.192 11a4.147 4.147 0 0 1-1.301-3V6.787m4.441 5.455v2.424m-2.539 0h5.08"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};
