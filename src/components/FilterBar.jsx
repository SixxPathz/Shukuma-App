import { filterOptions } from '../data/metadata';

const FilterBar = ({ filters, onFilterChange }) => {
  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };

  return (
    <div className="bg-white shadow-sm border-b-2 border-black p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-semibold text-black mb-4">Filter Exercises</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="w-full px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              {filterOptions.difficulty.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              {filterOptions.type.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Duration Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
              className="w-full px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              {filterOptions.duration.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filters Button */}
        {(filters.difficulty !== 'All' || filters.type !== 'All' || filters.duration !== 'All') && (
          <button
            onClick={() => onFilterChange({ difficulty: 'All', type: 'All', duration: 'All' })}
            className="mt-4 px-4 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
