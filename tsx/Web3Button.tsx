<button
  className="bg-gradient-to-r from-yellow-400 to-red-500 hover:from-red-500 hover:to-yellow-400 
             text-black font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl 
             transition-all duration-300 ease-in-out transform hover:-translate-y-1"
>
  {isConnected ? `🦊 ${address?.slice(0,6)}...` : "🔥 CONECTAR WALLET"}
</button>