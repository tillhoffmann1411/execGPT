import XlsxUploader from './components/xlsxUploader';
import Card from './components/card';



export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="flex place-items-center h-1/2">
        <h1 className="h-full">execGPT</h1>
      </div>

      <XlsxUploader />

      <div className="mb-32 grid text-center
      lg:max-w-5xl lg:w-full lg:mb-0 lg:text-left
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
    </main>
  )
}
