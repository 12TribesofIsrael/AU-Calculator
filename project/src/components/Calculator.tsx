import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, CreditCard, Target, Info, ExternalLink, Share2, Download } from 'lucide-react';

interface CalculationResult {
  currentUtilization: number;
  targetCredit: number;
  additionalCreditNeeded: number;
  isAlreadyBelow: boolean;
}

const Calculator: React.FC = () => {
  const [currentBalance, setCurrentBalance] = useState<string>('');
  const [currentCredit, setCurrentCredit] = useState<string>('');
  const [targetUtilization, setTargetUtilization] = useState<number>(10);
  const [customTarget, setCustomTarget] = useState<string>('');
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const calculateResult = () => {
    const balance = parseFloat(currentBalance.replace(/,/g, ''));
    const credit = parseFloat(currentCredit.replace(/,/g, ''));
    const target = useCustom ? parseFloat(customTarget) : targetUtilization;

    if (!balance || !credit || !target || balance < 0 || credit < 0 || target <= 0) {
      return;
    }

    const currentUtil = (balance / credit) * 100;
    const targetCredit = balance / (target / 100);
    const additionalCredit = Math.max(0, targetCredit - credit);

    setResult({
      currentUtilization: currentUtil,
      targetCredit: targetCredit,
      additionalCreditNeeded: additionalCredit,
      isAlreadyBelow: currentUtil <= target
    });
  };

  useEffect(() => {
    if (currentBalance && currentCredit && (targetUtilization || customTarget)) {
      calculateResult();
    }
  }, [currentBalance, currentCredit, targetUtilization, customTarget, useCustom]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: string) => {
    const value = num.replace(/,/g, '');
    if (value === '') return '';
    return parseFloat(value).toLocaleString();
  };

  const shareResult = () => {
    if (!result) return;
    const text = `I need an AU tradeline with ${formatCurrency(result.additionalCreditNeeded)} credit limit to reach ${useCustom ? customTarget : targetUtilization}% utilization!`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  const exportResult = () => {
    if (!result) return;
    const data = {
      currentBalance: formatCurrency(parseFloat(currentBalance.replace(/,/g, ''))),
      currentCredit: formatCurrency(parseFloat(currentCredit.replace(/,/g, ''))),
      targetUtilization: `${useCustom ? customTarget : targetUtilization}%`,
      additionalCreditNeeded: formatCurrency(result.additionalCreditNeeded),
      currentUtilization: `${result.currentUtilization.toFixed(1)}%`
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'au-tradeline-calculation.json';
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Calculator */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <CalcIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">AU Tradeline Calculator</h2>
          </div>
          <button
            onClick={() => setShowInfoModal(true)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Info className="w-5 h-5 mr-1" />
            What is an AU tradeline?
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Total Credit Utilization ($)
                <span className="text-blue-600 cursor-help ml-1" title="The total balance currently being used across all your credit cards. It includes all your outstanding balances, even if they aren't due yet.">ⓘ</span>
              </label>
              <input
                type="text"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(formatNumber(e.target.value))}
                placeholder="e.g., 18,000 (Card 1: $2,000 + Card 2: $14,000 + Card 3: $2,000)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Total Available Credit ($)
                <span className="text-blue-600 cursor-help ml-1" title="The sum of all credit limits across your active revolving credit accounts (typically credit cards) not spent. This is how much credit you could use if all your cards were not maxed out.">ⓘ</span>
              </label>
              <input
                type="text"
                value={currentCredit}
                onChange={(e) => setCurrentCredit(formatNumber(e.target.value))}
                placeholder="e.g., $0 (Card 1: $5,000 + Card 2: $10,000 + Card 3: $3,000)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Target Utilization (%)
                <span className="text-blue-600 cursor-help ml-1" title="Most lenders prefer under 30%, but under 10% is ideal for funding and top credit scores">ⓘ</span>
              </label>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => { setTargetUtilization(10); setUseCustom(false); }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      !useCustom && targetUtilization === 10
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    10% (Optimal)
                  </button>
                  <button
                    onClick={() => { setTargetUtilization(30); setUseCustom(false); }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      !useCustom && targetUtilization === 30
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    30% (Standard)
                  </button>
                  <button
                    onClick={() => setUseCustom(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      useCustom
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Custom
                  </button>
                </div>
                
                {useCustom && (
                  <input
                    type="number"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    placeholder="Enter custom %"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    min="1"
                    max="100"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Results</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">Current Utilization</div>
                    <div className={`text-2xl font-bold ${result.currentUtilization > 30 ? 'text-red-600' : result.currentUtilization > 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {result.currentUtilization.toFixed(1)}%
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">Target Total Credit Needed</div>
                    <div className="text-xl font-bold text-gray-800">
                      {formatCurrency(result.targetCredit)}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">Additional Credit Required</div>
                    <div className={`text-2xl font-bold ${result.isAlreadyBelow ? 'text-green-600' : 'text-blue-600'}`}>
                      {result.isAlreadyBelow ? '$0' : formatCurrency(result.additionalCreditNeeded)}
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${result.isAlreadyBelow ? 'bg-green-100 border border-green-200' : 'bg-blue-100 border border-blue-200'}`}>
                  {result.isAlreadyBelow ? (
                    <div className="flex items-start">
                      <span className="text-green-600 text-xl mr-2">✅</span>
                      <div className="text-green-800">
                        <strong>No AU tradeline needed!</strong> You're already below your target utilization of {useCustom ? customTarget : targetUtilization}%.
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <span className="text-blue-600 text-xl mr-2">🔥</span>
                      <div className="text-blue-800">
                        To reach your target of under <strong>{useCustom ? customTarget : targetUtilization}% utilization</strong>, you need <strong>AU tradeline(s) totaling {formatCurrency(result.additionalCreditNeeded)} in credit limits</strong>. This could be one high-limit card or multiple cards that add up to this amount.
                      </div>
                    </div>
                  )}
                </div>

                {!result.isAlreadyBelow && (
                  <div className="flex gap-2">
                    <button
                      onClick={shareResult}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </button>
                    <button
                      onClick={exportResult}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Enter your credit information to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Example Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">📊 Why Credit Utilization Matters</h3>
        <div className="bg-white rounded-lg p-6 mb-6">
          <p className="text-gray-700 mb-4">
            Credit utilization is a major driver of your credit score—as much as <strong>30%</strong> of your FICO score and <strong>20%</strong> of VantageScore. Here's how crossing key thresholds can affect your score:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="font-bold text-red-800 mb-2">⚠️ Over 30% Utilization</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Significant negative impact</li>
                <li>• 50%+ usage: 10-50 point drops</li>
                <li>• 90-100%: 100+ point drops</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-bold text-yellow-800 mb-2">✅ 10-30% Utilization</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Good benchmark range</li>
                <li>• Minimal negative impact</li>
                <li>• Safe zone for most lenders</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-bold text-green-800 mb-2">🌟 Under 10% - Ideal Zone</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Maximizes credit score</li>
                <li>• +10-50 points vs higher use</li>
                <li>• Critical for funding/top-tier credit</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">📈 Utilization Impact Summary</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Utilization Range</th>
                    <th className="text-left py-2">Score Impact</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  <tr className="border-b">
                    <td className="py-2 font-medium text-green-700">Under 10%</td>
                    <td className="py-2">Ideal—maximizes score; +10–50 points over higher use</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium text-yellow-700">10–30%</td>
                    <td className="py-2">Good—safe zone, minimal negative impact</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium text-orange-700">Over 30%</td>
                    <td className="py-2">Noticeable decline—might cost tens of points</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium text-red-700">Over 50%</td>
                    <td className="py-2"><strong>High risk</strong>—potential drop of 50–100+ points</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-red-800">90–100%</td>
                    <td className="py-2"><strong>Severe</strong>—huge impact, likely 100+ point drop</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🔧 Why It Happens</h4>
            <p className="text-blue-700 text-sm">
              Credit scoring algorithms interpret high utilization as a sign of financial <strong>stress or overextension</strong>, increasing perceived risk. Utilization is the <strong>second-largest factor</strong> in FICO, accounting for ~30% of the overall score.
            </p>
          </div>
          
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ The Bottom Line</h4>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Exceeding <strong>30% utilization</strong> can noticeably damage your credit score</li>
              <li>• Staying <strong>under 10%</strong> is the sweet spot for maximizing score potential</li>
              <li>• Always monitor and pay down balances before statement dates to keep utilization low</li>
            </ul>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Example Calculation</h3>
        <div className="bg-white rounded-lg p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">🔹 Current Total Available Credit</h4>
            <p className="text-gray-700 mb-2">
              <strong>Definition:</strong> The sum of all credit limits across your active revolving credit accounts (typically credit cards). This is how much credit you could use if all your cards were maxed out.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <strong>Example:</strong> If you have:<br/>
              • Card 1: $5,000 limit and spent it all<br/>
              • Card 2: $10,000 limit and spent it all<br/>
              • Card 3: $3,000 limit and spent it all<br/>
              <strong>Then your Current Total Available Credit = $0</strong><br/>
              <br/>
              This means you are at <strong>100% utilization</strong> and have no available credit left.<br/>
              <br/>
              <em>Tip: You can check your available credit by logging into your credit card account online or by looking at your latest statement. The available credit is usually shown as the difference between your credit limit and your current balance.</em>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">🔹 Current Total Credit Utilization</h4>
            <p className="text-gray-700 mb-2">
              <strong>Definition:</strong> The total balance currently being used across all your credit cards. It includes all your outstanding balances, even if they aren't due yet.
            </p>
            <div className="bg-green-50 p-3 rounded-lg text-sm">
              <strong>Example:</strong> If you've spent:<br/>
              • Card 1: $2,000 balance<br/>
              • Card 2: $14,000 balance<br/>
              • Card 3: $2,000 balance<br/>
              <strong>Then your Current Total Credit Utilization = $18,000</strong>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Using the example above: If your utilization is <strong>$18,000</strong> and your available credit is also <strong>$18,000</strong>, you're at <strong>100% utilization</strong>.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">To get under 30%:</h4>
              <div className="text-sm text-blue-700 font-mono">
                $18,000 ÷ 0.30 = $60,000<br/>
                Need $42,000 more
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">To get under 10%:</h4>
              <div className="text-sm text-green-700 font-mono">
                $18,000 ÷ 0.10 = $180,000<br/>
                Need $162,000 more
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Links */}
      <div className="grid md:grid-cols-3 gap-6">
        <a
          href="https://theprosperitypathai.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">Need Credit Repair?</h3>
              <p className="text-red-100 text-sm">Professional credit restoration services</p>
            </div>
            <ExternalLink className="w-6 h-6" />
          </div>
        </a>

        <a
          href="https://bornmadebossessolutions.com/calendar-1813"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">Need Mentorship?</h3>
              <p className="text-green-100 text-sm">One-on-one guidance and support</p>
            </div>
            <ExternalLink className="w-6 h-6" />
          </div>
        </a>

        <a
          href="https://bornmadebossessolutions.com/calendar-1813"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">Purchase AU Tradelines</h3>
              <p className="text-blue-100 text-sm">Get the credit limit you need</p>
            </div>
            <ExternalLink className="w-6 h-6" />
          </div>
        </a>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">What is an AU Tradeline?</h3>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  An <strong>Authorized User (AU) tradeline</strong> is when you're added as an authorized user to someone else's credit card account. This allows their positive payment history and credit limit to appear on your credit report.
                </p>
                
                <h4 className="font-semibold text-lg text-gray-800">How it helps:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>Instantly increases your total available credit</li>
                  <li>Lowers your overall credit utilization percentage</li>
                  <li>Can improve your credit score within 30-45 days</li>
                  <li>Adds positive payment history to your credit report</li>
                </ul>
                
                <h4 className="font-semibold text-lg text-gray-800">Important notes:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>You don't get a physical card or spending access</li>
                  <li>The account owner's payment history affects you</li>
                  <li>Tradelines typically stay on your report for 60-90 days</li>
                  <li>Choose reputable providers with established accounts</li>
                </ul>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
