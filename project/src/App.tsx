import Calculator from './components/Calculator';

// Add this for Vite env typing correct
/// <reference types="vite/client" />

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src={`${import.meta.env.BASE_URL}blue.png`} 
              alt="BestMade SMB Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            AU Tradeline Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Determine how much additional credit you need to reach your target utilization percentage
          </p>
        </div>
        
        <Calculator />
      </div>
    </div>
  );
}

export default App;
