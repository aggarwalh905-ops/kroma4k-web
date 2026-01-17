export default function SearchBar({ onSearch, onStyleChange, activeStyle }: any) {
  const styles = ["All", "Cyberpunk", "Anime", "Nature", "Space"];
  
  return (
    <div className="flex flex-col gap-4 mb-8">
      <input 
        type="text" 
        placeholder="Search 10,000+ wallpapers..." 
        className="p-4 rounded-xl bg-gray-800 text-white border border-gray-700 w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="flex gap-2 overflow-x-auto pb-2">
        {styles.map(s => (
          <button 
            key={s}
            onClick={() => onStyleChange(s)}
            className={`px-4 py-1 rounded-full text-sm ${activeStyle === s ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}