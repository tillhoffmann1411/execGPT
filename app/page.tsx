'use client';
import MainUpload from './components/mainUpload';
import Card from './components/card';
import Hero from './components/hero';
import useDarkMode from './darkMode';



export default function Home() {
  const { colorTheme, setTheme } = useDarkMode();

  const toggleDarkMode = () => {
    setTheme((prev) => prev === 'dark' ? 'light' : 'dark');
  }

  return (
    <main className={"min-h-screen bg-white dark:bg-blue-950"}>

      <Hero toggleDarkMode={toggleDarkMode} />

      <div className="px-4 pt-8 flex flex-col items-center">
        <MainUpload />

        <div className="my-32 grid text-center
        lg:max-w-5xl lg:w-full lg:text-left
        md:grid-cols-4">
          <Card
            title="Upload"
            description="Upload your excel sheet"
            href="/upload"
          />
          <Card
            title="Generate"
            description="Generate your GPT-3 text"
            href="/generate"
          />
          <Card
            title="Download"
            description="Download your excel sheet"
            href="/download"
          />
          <Card
            title="About"
            description="Learn more about execGPT"
            href="/about"
          />
        </div>
      </div>


    </main>
  )
}
