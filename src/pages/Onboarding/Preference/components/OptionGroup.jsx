import ChoiceButton from "./ChoiceButton";
import "./OptionGroup.scss";

const OptionGroup = ({
  options,
  columns = 1,
  variant = "list",
  selectedValues = [],
  onChange,
  maxSelect = Infinity,
}) => {
  const handleSelect = (id) => {
    const isSelected = selectedValues.includes(id);

    if (isSelected) {
      onChange(selectedValues.filter((value) => value !== id));
      return;
    }

    if (variant === "pair") {
      const group = Math.ceil(id / 2);

      const newSelected = selectedValues.filter(
        (value) => Math.ceil(value / 2) !== group,
      );

      if (newSelected.length >= maxSelect) return;

      onChange([...newSelected, id]);
      return;
    }

    if (selectedValues.length >= maxSelect) return;

    onChange([...selectedValues, id]);
  };

  return (
    <div className={`optiongroup_box columns-${columns}`}>
      {options.map((option) => (
        <ChoiceButton
          key={option.id}
          label={option.label}
          selected={selectedValues.includes(option.id)}
          onClick={() => handleSelect(option.id)}
          variant={variant}
        />
      ))}
    </div>
  );
};

export default OptionGroup;
