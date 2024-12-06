import {
  Bs1SquareFill,
  BsEnvelopePaperHeartFill,
  BsGithub,
  BsShuffle,
} from "solid-icons/bs";
import { setLaunchApp } from "~/global";
import Button from "~/components/Button";
import "@fontsource-variable/archivo";

export default function LandingPage() {
  return (
    <div class="animate-fade">
      {/* Header */}
      <header class="flex items-center space-x-4 px-8 py-4 border-b bg-zinc-930/80 sticky top-0 backdrop-blur-xl z-50">
        <button onClick={() => window.location.reload()}>
          <img src="/icon.svg" class="w-10 h-10" alt="ThirdCloud Icon" />
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
          onClick={() => setLaunchApp(true)}
        >
          <div>Launch App</div>
        </button>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section class="relative overflow-hidden">
          <div class="absolute top-0 left-0 -z-10 w-screen h-full flex items-center">
            <div class="bg-grid lg:bg-grid-lg h-full flex-1">
              <div class="bg-gradient-to-r from-transparent via-[#0c0c0c] to-[#0c0c0c] w-full h-full" />
            </div>
            <div class="bg-grid lg:bg-grid-lg h-full flex-1">
              <div class="bg-gradient-to-r -scale-x-100 from-transparent via-[#0c0c0c] to-[#0c0c0c] w-full h-full" />
            </div>
          </div>
          <div class="space-y-16 p-8 py-16 lg:py-32 text-center">
            <h1 class="lg:text-8xl font-black text-6xl">ThirdCloud</h1>
            <h2 class="text-4xl lg:text-6xl animate-text-gradient bg-gradient-to-r from-[#e0e0e0] via-[#747474] to-[#dadada] bg-[200%_auto] bg-clip-text text-transparent">
              All-in-one collaboration suite
            </h2>
            <img
              src="/listApps.png"
              class="h-16 lg:h-24 mx-auto"
              alt="ThirdCloud Features Overview"
            />
          </div>
        </section>

        {/* Features Section */}
        <section class="pt-16 pb-8 space-y-8">
          <div class="px-8 lg:px-32 text-center space-y-2">
            <h2 class="text-4xl">
              <span class="avoidwrap">Increase Efficiency,</span>{" "}
              <span class="avoidwrap">Reduce Costs</span>
            </h2>
            <p class="text-zinc-500">
              ThirdCloud helps you work smarter by bringing your tools and data
              together
            </p>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="space-y-4 text-center flex flex-col items-center">
              <div class="text-zinc-400 p-4 rounded-lg border bg-zinc-930 hover:bg-zinc-900 duration-150">
                <Bs1SquareFill class="w-6 h-6" />
              </div>
              <div class="space-y-1">
                <h3 class="text-xl">One Platform</h3>
                <p class="text-zinc-500">All your tools in one place</p>
              </div>
            </div>
            <div class="space-y-4 text-center flex flex-col items-center">
              <div class="text-zinc-400 p-4 rounded-lg border bg-zinc-930 hover:bg-zinc-900 duration-150">
                <BsEnvelopePaperHeartFill class="w-6 h-6" />
              </div>
              <div class="space-y-1">
                <h3 class="text-xl">Easy Teamwork</h3>
                <p class="text-zinc-500">
                  Collaborate smoothly across divisions
                </p>
              </div>
            </div>
            <div class="space-y-4 text-center flex flex-col items-center">
              <div class="text-zinc-400 p-4 rounded-lg border bg-zinc-930 hover:bg-zinc-900 duration-150">
                <BsShuffle class="w-6 h-6" />
              </div>
              <div class="space-y-1">
                <h3 class="text-xl">Adaptable Workflows</h3>
                <p class="text-zinc-500">
                  Add third-party apps to fit the way you work
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Extensions Section */}
        <section class="py-16 text-center space-y-8">
          <div class="space-y-2 ">
            <h2 class="text-4xl text-zinc-500">
              Extend ThirdCloud with{" "}
              <span class="text-white font-semibold">third-party apps</span>
            </h2>
            <p class="text-zinc-500">—just like in VS Code!</p>
          </div>
          <div class="lg:px-32 px-2">
            <img
              src="/screenshot.png"
              class="w-full border "
              alt="Third-party App Integration Example"
            />
          </div>
        </section>

        {/* Developer Section */}
        <section class="flex flex-col items-center bg-[#121212]  border my-8  mx-2 lg:mx-48">
          <div class="space-y-8 px-4 lg:px-16 sm:space-y-0 sm:flex sm:flex-row sm:space-x-16 py-16">
            <div class="space-y-3">
              <h3 class="text-2xl font-semibold">Are you a developer?</h3>
              <p class="text-zinc-500">
                Build a ThirdCloud app with the tools you love!
              </p>
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
            <div class="flex items-center gap-8 flex-wrap">
              <img
                src="/framework/react.svg"
                class="w-16 h-16"
                alt="React Framework Logo"
              />
              <img
                src="/framework/vue.svg"
                class="w-16 h-16"
                alt="Vue Framework Logo"
              />
              <img
                src="/framework/js.svg"
                class="w-16 h-16"
                alt="JavaScript Framework Logo"
              />
              <img
                src="/framework/qwik.svg"
                class="w-16 h-16"
                alt="Qwik Framework Logo"
              />
              <img
                src="/framework/solid.svg"
                class="w-16 h-16"
                alt="SolidJS Framework Logo"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer class="relative mt-16">
          <img
            src="/cloud.jpg"
            class="w-full grayscale absolute h-full object-cover -z-20"
            alt="Background Cloud Image"
          />
          <div class="absolute bg-black/80 h-full w-full -z-10"></div>
          <div class="px-8 lg:px-32 py-16 space-y-4 text-white">
            <img src="/icon.svg" class="w-10 h-10" alt="ThirdCloud Icon" />
            <div>
              <h3 class="font-semibold text-2xl">Proudly Open Source</h3>
              <p class="text-zinc-400">
                ThirdCloud welcomes contributions and feedback. Join us and
                shape the future of collaborative work!
              </p>
            </div>
            <p class="text-xs text-zinc-400">
              For any questions or support, reach out via{" "}
              <a
                href="mailto:support@thirdcloud.org"
                class="hover:text-white duration-150 font-bold"
              >
                support@thirdcloud.org
              </a>
            </p>
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
        </footer>
      </main>
    </div>
  );
}
