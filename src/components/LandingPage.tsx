import { marked } from "marked";
import readme from "../../README.md?raw";
import { BsGithub, BsRocket, BsRocketFill } from "solid-icons/bs";
import { setLaunchApp } from "~/global";
import Button from "~/components/Button";

export default function LandingPage() {
  const html = () => marked.parse(readme) as string;

  return (
    <div class="animate-fade">
      <div class="flex items-center space-x-4 px-8 py-4 border-b bg-zinc-930/80 sticky top-0 backdrop-blur-xl">
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

        <Button
          onClick={() => {
            setLaunchApp(true);
          }}
          icons={{
            idle: BsRocketFill,
          }}
        >
          <div>Launch App</div>
        </Button>
      </div>
      <div class="p-8">
        <div
          class="prose prose-invert prose-zinc text-white max-w-none flex-1 "
          innerHTML={html()}
        />
      </div>
    </div>
  );
}
