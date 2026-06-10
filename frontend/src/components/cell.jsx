const Cell = ({ value, isReadOnly, isError, onChange, onClick }) => {
  const handleChange = (e) => {
    if (isReadOnly) return;
    const val = e.target.value;
    
    // Берем только последнюю введенную цифру (если ввели 2 цифры быстро)
    const lastChar = val.slice(-1); 
    
    if (lastChar === "" || /^[1-9]$/.test(lastChar)) {
      onChange(lastChar === "" ? 0 : parseInt(lastChar));
    }
  };

  return (
    <input
      className={`sudoku-cell 
                ${isReadOnly ? "readonly" : "editable"} 
                ${isError ? "error" : ""}`}
      type="text"
      inputMode="numeric" // Удобно для мобильных устройств
      value={value === 0 ? "" : value}
      readOnly={isReadOnly}
      onChange={handleChange}
      onClick={(e) => {
        // Предотвращаем стандартное поведение, если нужно просто "покрасить" клетку
        onClick();
      }}
      onFocus={(e) => {
        // Если число в панели НЕ выбрано, выделяем содержимое для удобного редактирования
        e.target.select();
      }}
    />
  );
};

export default Cell;