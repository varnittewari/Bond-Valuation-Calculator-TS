"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { InfoIcon as InfoCircle, RefreshCw } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function BondCalculator() {
  // Bond parameters
  const [faceValue, setFaceValue] = useState(1000)
  const [couponRate, setCouponRate] = useState(5)
  const [marketRate, setMarketRate] = useState(5)
  const [yearsToMaturity, setYearsToMaturity] = useState(10)
  const [paymentFrequency, setPaymentFrequency] = useState("2") // Default: semi-annual

  // Results
  const [bondValue, setBondValue] = useState(0)
  const [couponPayment, setCouponPayment] = useState(0)
  const [totalCoupons, setTotalCoupons] = useState(0)
  const [bondStatus, setBondStatus] = useState("")

  // Calculate bond value
  useEffect(() => {
    calculateBondValue()
  }, [faceValue, couponRate, marketRate, yearsToMaturity, paymentFrequency])

  const calculateBondValue = () => {
    // Convert percentages to decimals
    const couponRateDecimal = couponRate / 100
    const marketRateDecimal = marketRate / 100

    // Number of payments per year
    const paymentsPerYear = Number.parseInt(paymentFrequency)

    // Total number of payments
    const totalPayments = paymentsPerYear * yearsToMaturity

    // Coupon payment per period
    const periodicCouponPayment = (faceValue * couponRateDecimal) / paymentsPerYear
    setCouponPayment(periodicCouponPayment)
    setTotalCoupons(totalPayments)

    // Periodic interest rate
    const periodicInterestRate = marketRateDecimal / paymentsPerYear

    // Present value of coupon payments
    let presentValueCoupons = 0
    for (let i = 1; i <= totalPayments; i++) {
      presentValueCoupons += periodicCouponPayment / Math.pow(1 + periodicInterestRate, i)
    }

    // Present value of face value at maturity
    const presentValueFaceValue = faceValue / Math.pow(1 + periodicInterestRate, totalPayments)

    // Total bond value
    const totalBondValue = presentValueCoupons + presentValueFaceValue
    setBondValue(totalBondValue)

    // Determine bond status
    if (Math.abs(totalBondValue - faceValue) < 0.01) {
      setBondStatus("At Par")
    } else if (totalBondValue > faceValue) {
      setBondStatus("Premium")
    } else {
      setBondStatus("Discount")
    }
  }

  const resetForm = () => {
    setFaceValue(1000)
    setCouponRate(5)
    setMarketRate(5)
    setYearsToMaturity(10)
    setPaymentFrequency("2")
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Bond Valuation Calculator</CardTitle>
        <CardDescription>Calculate the present value of a bond based on its parameters</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="faceValue" className="text-sm font-medium">
                  Face Value
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        The nominal value of the bond that will be paid back at maturity.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="faceValue"
                  type="number"
                  min="0"
                  value={faceValue}
                  onChange={(e) => setFaceValue(Number.parseFloat(e.target.value) || 0)}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="couponRate" className="text-sm font-medium">
                  Coupon Rate (%)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Annual interest rate paid by the bond issuer.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <Slider
                  id="couponRate"
                  min={0}
                  max={20}
                  step={0.1}
                  value={[couponRate]}
                  onValueChange={(value) => setCouponRate(value[0])}
                />
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">0%</span>
                  <span className="text-sm font-medium">{couponRate.toFixed(1)}%</span>
                  <span className="text-xs text-gray-500">20%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="marketRate" className="text-sm font-medium">
                  Market Interest Rate (%)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Current market yield for similar bonds (discount rate).</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <Slider
                  id="marketRate"
                  min={0}
                  max={20}
                  step={0.1}
                  value={[marketRate]}
                  onValueChange={(value) => setMarketRate(value[0])}
                />
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">0%</span>
                  <span className="text-sm font-medium">{marketRate.toFixed(1)}%</span>
                  <span className="text-xs text-gray-500">20%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="yearsToMaturity" className="text-sm font-medium">
                  Years to Maturity
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">Number of years until the bond matures.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="yearsToMaturity"
                type="number"
                min="1"
                max="100"
                value={yearsToMaturity}
                onChange={(e) => setYearsToMaturity(Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="paymentFrequency" className="text-sm font-medium">
                  Payment Frequency
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">How often interest payments are made per year.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
                <SelectTrigger id="paymentFrequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Annual (1/year)</SelectItem>
                  <SelectItem value="2">Semi-annual (2/year)</SelectItem>
                  <SelectItem value="4">Quarterly (4/year)</SelectItem>
                  <SelectItem value="12">Monthly (12/year)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Bond Value</h3>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">${bondValue.toFixed(2)}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    bondStatus === "At Par"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : bondStatus === "Premium"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {bondStatus}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Coupon Payment:</span>
                  <span>
                    ${couponPayment.toFixed(2)} × {totalCoupons} payments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" onClick={resetForm} className="flex items-center gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
          <p>PV = Coupon × [(1 - (1 + r)^-n) / r] + Face Value × (1 + r)^-n</p>
          <p>where r = yield per period, n = total periods</p>
        </div>
      </CardFooter>
    </Card>
  )
}
