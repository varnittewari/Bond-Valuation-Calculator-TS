import BondCalculator from "@/components/bond-calculator"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <BondCalculator />
    </main>
  )
}
