import {
  Bs1SquareFill,
  BsArrowRight,
  BsEnvelopePaperHeartFill,
  BsGithub,
  BsShuffle,
} from "solid-icons/bs";
import { setLaunchApp } from "~/global";
import Button from "~/components/Button";
import "@fontsource-variable/archivo";
import { createSignal, onMount } from "solid-js";

function LaunchAppButton() {
  const [scrolled, setScrolled] = createSignal(false);
  onMount(() => {
    const element = document.getElementById("mark");
    if (element) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].boundingClientRect.bottom <= 0) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
        },
        { rootMargin: "0px" }
      );
      observer.observe(element);
    }
  });

  return (
    <button
      data-scrolled={scrolled()}
      class="el btn flex items-center space-x-2 
      data-[scrolled=true]:!bg-[#6321f2] 
      data-[scrolled=true]:hover:!bg-[#6626f2] 
      data-[scrolled=true]:!text-white 
      data-[scrolled=true]:border 
      data-[scrolled=true]:border-[#a168ff] 
      data-[scrolled=true]:drop-shadow-sm 
      data-[scrolled=true]:!shadow-[#6726f23b]/20 
      data-[scrolled=true]:hover:!shadow-[#6626f2]/50
      "
      onClick={() => setLaunchApp(true)}
    >
      <div>
        Launch <span class="hidden md:inline-block"> App</span>
      </div>
    </button>
  );
}

export default function LandingPage() {
  return (
    <div class="animate-fade">
      {/* Header */}
      <header class="flex items-center space-x-4 px-8 py-4 border-b bg-neutral-930/80 sticky top-0 backdrop-blur-xl z-50">
        <button
          onClick={() => window.location.reload()}
          class="flex items-center space-x-2"
        >
          <img src="/icon.svg" class="w-10 h-10" alt="ThirdCloud Icon" />
          <div class=" text-xl font-bold">ThirdCloud</div>
        </button>
        <div class="flex-1" />
        <a
          href="https://github.com/thirdcloud-org/thirdcloud"
          target="_blank"
          rel="noopener noreferrer"
          class="text-neutral-500 hover:text-white duration-150"
        >
          <BsGithub class="w-6 h-6" />
        </a>
        <LaunchAppButton />
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section class="relative overflow-hidden" id="mark">
          <div class="absolute top-0 left-0 -z-10 w-screen h-full flex items-center">
            <div class="bg-grid lg:bg-grid-lg h-full flex-1">
              <div
                class="
              lg:bg-gradient-to-r lg:from-transparent lg:via-[#0c0c0c] lg:to-[#0c0c0c] 
              bg-[#0c0c0c] lg:bg-transparent
              w-full h-full"
              />
            </div>

            <div class="bg-grid lg:bg-grid-lg h-full flex-1">
              <div class="bg-gradient-to-r -scale-x-100 from-transparent via-[#0c0c0c] to-[#0c0c0c] w-full h-full" />
            </div>
          </div>

          <div class="space-y-16 px-8 py-16 lg:py-32 ">
            <div class="mx-auto max-w-3xl space-y-8">
              <img
                src="/listApps.png"
                class="h-16 lg:h-24"
                alt="ThirdCloud Features Overview"
              />
              <h1 class="lg:text-7xl font-semibold text-6xl">
                <span class="avoidwrap">Bring everything</span>{" "}
                <span class="avoidwrap">your team</span> needs together
              </h1>

              <div class="text-xl lg:text-2xl text-neutral-400">
                A space to work smarter and have fun along the way
              </div>

              <button
                onClick={() => setLaunchApp(true)}
                class="el btn flex items-center space-x-2 !bg-[#6321f2] hover:!bg-[#6626f2] !text-white border border-[#a168ff] drop-shadow-sm !shadow-[#6726f23b]/20 hover:!shadow-[#6626f2]/50 text-4xl"
              >
                TRY IT FREE{" "}
                <span>
                  <BsArrowRight class="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Extensions Section */}
        <section class="py-16 text-center space-y-8">
          <div class="space-y-2 ">
            <h2 class="text-4xl text-neutral-400">
              Extend ThirdCloud with{" "}
              <span class="text-white font-semibold">third-party apps</span>
            </h2>
            <p class="text-neutral-400">—just like in VS Code!</p>
          </div>
          <div class="lg:px-32 px-2">
            <img
              src="/screenshot.png"
              class="w-full border "
              alt="Third-party App Integration Example"
            />
          </div>
        </section>

        {/* Features Section */}
        <section class="pt-16 pb-8 space-y-8">
          <div class="px-8 lg:px-32 text-center space-y-2">
            <h2 class="text-4xl">
              <span class="avoidwrap">Do it better</span>{" "}
              <span class="avoidwrap">without breaking the bank</span>
            </h2>
            <p class="text-neutral-500">
              ThirdCloud brings your tools{" "}
              <span class="avoidwrap">and data together</span>
            </p>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="space-y-4 text-center flex flex-col items-center">
              <div class="text-neutral-400 p-4 rounded-lg border bg-neutral-930 hover:bg-neutral-900 duration-150">
                <Bs1SquareFill class="w-6 h-6" />
              </div>
              <div class="space-y-1">
                <h3 class="text-xl">One Platform</h3>
                <p class="text-neutral-500">All your tools in one place</p>
              </div>
            </div>
            <div class="space-y-4 text-center flex flex-col items-center">
              <div class="text-neutral-400 p-4 rounded-lg border bg-neutral-930 hover:bg-neutral-900 duration-150">
                <BsEnvelopePaperHeartFill class="w-6 h-6" />
              </div>
              <div class="space-y-1">
                <h3 class="text-xl">Easy Teamwork</h3>
                <p class="text-neutral-500">
                  Collaborate smoothly across divisions
                </p>
              </div>
            </div>
            <div class="space-y-4 text-center flex flex-col items-center">
              <div class="text-neutral-400 p-4 rounded-lg border bg-neutral-930 hover:bg-neutral-900 duration-150">
                <BsShuffle class="w-6 h-6" />
              </div>
              <div class="space-y-1">
                <h3 class="text-xl">Adaptable Workflows</h3>
                <p class="text-neutral-500">
                  Add third-party apps to fit the way you work
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section class="flex flex-col items-center bg-[#121212]  border my-8  mx-2 lg:mx-48">
          <div class="space-y-8 px-4 lg:px-16 sm:space-y-0 sm:flex sm:flex-row sm:space-x-16 py-16">
            <div class="space-y-3">
              <h3 class="text-2xl font-semibold">Are you a developer?</h3>
              <p class="text-neutral-500">
                Build a ThirdCloud app with the framework{" "}
                <br class="hidden lg:block" />
                you know and love!
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
            <div class="space-y-1">
              <h3 class="font-semibold text-2xl">Proudly Open Source</h3>
              <p class="text-neutral-400">
                ThirdCloud welcomes contributions and feedback.
                <br />
                Join us and shape the future of collaborative work!
              </p>
            </div>
            <p class="text-xs text-neutral-400">
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
                class="text-neutral-500 hover:text-white duration-150"
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
