import { marked } from "marked";
import readme from "../../README.md?raw";
import {
  Bs1SquareFill,
  BsEnvelopePaperHeartFill,
  BsGithub,
  BsRocket,
  BsRocketFill,
  BsShuffle,
} from "solid-icons/bs";
import { setLaunchApp } from "~/global";
import Button from "~/components/Button";
import "@fontsource-variable/archivo";

export default function LandingPage() {
  return (
    <div class="animate-fade">
      <div class="flex items-center space-x-4 px-8 py-4 border-b bg-zinc-930/80 sticky top-0 backdrop-blur-xl z-50">
        <button onClick={() => window.location.reload()}>
          <img src="/icon.svg" class="w-10 h-10" />
        </button>
        <div class="flex-1" />
        <a
          href="https://github.com/thirdcloud-org/thirdcloud"
          target="_blank"
          rel="noopener noreferrer"
          class="text-zinc-500 hover:text-white duration-150"
        >
          <BsGithub class="w-6 h-6" />
        </a>

        <button
          class="el btn flex items-center space-x-2 !bg-[#6321f2] hover:!bg-[#6626f2] !text-white border border-[#a168ff] drop-shadow-sm !shadow-[#6726f23b]/20 hover:!shadow-[#6626f2]/50"
          onClick={() => {
            setLaunchApp(true);
          }}
        >
          <div>Launch App</div>
        </button>
      </div>

      <div class="">
        <div class="h-[520px] relative overflow-hidden">
          <div class="absolute top-0 left-0 -z-10 w-screen h-full flex items-center">
            <div class="bg-grid lg:bg-grid-lg h-full flex-1">
              <div class="bg-gradient-to-r from-transparent  via-[#0c0c0c] to-[#0c0c0c] w-full h-full" />
            </div>

            <div class="bg-grid lg:bg-grid-lg h-full flex-1">
              <div class="bg-gradient-to-r -scale-x-100 from-transparent  via-[#0c0c0c] to-[#0c0c0c] w-full h-full" />
            </div>
          </div>

          <div class="space-y-16  p-8 translate-y-16">
            <div class="space-y-4 font-archivo">
              <div class="lg:text-8xl font-black text-6xl text-center">
                ThirdCloud
              </div>
              <div
                class="text-4xl lg:text-6xl animate-text-gradient bg-gradient-to-r from-[#e0e0e0] via-[#747474] to-[#dadada] 
    bg-[200%_auto] bg-clip-text text-transparent text-center"
              >
                All-in-one collaboration suite
              </div>
            </div>
            <div class="flex flex-col items-center">
              <img src="/listApps.png" class="h-16 lg:h-24" />
            </div>
          </div>
        </div>

        <div class="pt-16 pb-8 space-y-16">
          <div class="px-8 lg:px-32 text-center space-y-2 ">
            <div class="text-4xl">
              <span class="avoidwrap">Increase Efficiency,</span>{" "}
              <span class="avoidwrap">Reduce Costs</span>
            </div>
            <div class="text-zinc-500">
              ThirdCloud helps you work smarter by bringing your tools and data
              together
            </div>
          </div>

          <div class="p-8 grid grid-cols-3 gap-8">
            <div class="space-y-4 text-center flex flex-col items-center">
              <div class="text-zinc-400 p-4 rounded-lg border bg-zinc-930 hover:bg-zinc-900 duration-150">
                <Bs1SquareFill class="w-6 h-6" />
              </div>

              <div class="space-y-1">
                <div class="text-xl">One Platform</div>
                <div class="text-zinc-500">All your tools in one place</div>
              </div>
            </div>

            <div class="space-y-4 text-center flex flex-col items-center">
              <div class="text-zinc-400 p-4 rounded-lg border bg-zinc-930 hover:bg-zinc-900 duration-150">
                <BsEnvelopePaperHeartFill class="w-6 h-6" />
              </div>

              <div class="space-y-1">
                <div class="text-xl">Easy Teamwork</div>
                <div class="text-zinc-500">
                  Collaborate smoothly across divisions
                </div>
              </div>
            </div>

            <div class="space-y-4 text-center flex flex-col items-center">
              <div class="text-zinc-400 p-4 rounded-lg border bg-zinc-930 hover:bg-zinc-900 duration-150">
                <BsShuffle class="w-6 h-6" />
              </div>

              <div class="space-y-1">
                <div class="text-xl">Adaptable Workflows</div>
                <div class="text-zinc-500">
                  Add third-party apps to fit the way you work
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="py-16 space-y-16">
          <div class="flex flex-col items-center px-16 space-y-4">
            <div class="text-center text-zinc-500  text-4xl">
              Extend ThirdCloud
              <br />
              with{" "}
              <span class="text-white font-semibold">third-party apps</span>
            </div>

            <div class="text-zinc-500">—just like in VS Code!</div>
          </div>

          <div class="lg:px-32 px-2">
            <img src="/screenshot.png" class="w-full border" />
          </div>
        </div>

        <div class="flex flex-col items-center bg-[#121212] mx-4 lg:mx-48 border">
          <div class="sm:flex items-start py-32 sm:space-x-16 sm:space-y-0 space-y-8 px-16">
            <div class="space-y-3 ">
              <div class="space-y-2">
                <div class="text-2xl font-semibold">Are you a developer? </div>
                <div class="text-zinc-500">
                  Build a ThirdCloud app with the tools you love!
                </div>
              </div>
              <Button
                onClick={() => {
                  window.open(
                    "https://github.com/thirdcloud-org/thirdcloud",
                    "_blank"
                  );
                }}
              >
                Get started
              </Button>
            </div>

            <div class="flex items-center gap-8 flex-wrap ">
              <img src="/framework/react.svg" class="w-16 h-16" />
              <img src="/framework/vue.svg" class="w-16 h-16" />
              <img src="/framework/js.svg" class="w-16 h-16" />
              <img src="/framework/qwik.svg" class="w-16 h-16" />
              <img src="/framework/solid.svg" class="w-16 h-16" />
            </div>
          </div>
        </div>

        <div class="mt-16 relative">
          <img
            src="/cloud.jpg"
            class="w-full grayscale absolute h-full object-cover -z-20"
          />

          <div class="absolute bg-black/80 h-full w-full  -z-10"></div>

          <div class="px-8 lg:px-32 py-16 space-y-4">
            <img src="/icon.svg" class="w-10 h-10" />
            <div class="space-y-2">
              <div class="font-semibold text-2xl">Proudly Open Source</div>
              <div class="text-zinc-400">
                ThirdCloud welcomes contributions and feedback.
                <br />
                Join us and shape the future of collaborative work!
              </div>
            </div>

            <div>
              <span class="text-xs text-zinc-400">
                For any questions or support, please feel free to reach out via
                <br />
                <a
                  href="mailto:support@thirdcloud.org"
                  class="hover:text-white  duration-150 font-bold"
                >
                  support@thirdcloud.org
                </a>
              </span>
            </div>

            <div>
              <a
                href="https://github.com/thirdcloud-org/thirdcloud"
                target="_blank"
                rel="noopener noreferrer"
                class="text-zinc-500 hover:text-white duration-150"
              >
                <BsGithub class="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
