import { useState, useEffect } from "react"
import { PropertyType, RegExp } from "../../types/property"
import { ValueType } from "../dialogs/EditDataSection"
type TextBoxNumberProps = {
  type: PropertyType.INTEGER_POSITIVE_NUMBER | PropertyType.NUMBER | PropertyType.POSITIVE_NUMBER
  max?: number
  min?: number
}
export type TextBoxProps = {
    setValue: (value: string) => void
    value: ValueType
    nullValue?: ValueType
    maxLength?: number
    name?: string
    disabled?: boolean
    submitOnLostFocus?: boolean
    width?: string
    styles?: object
} & (TextBoxNumberProps | 
  {
    type: Exclude<PropertyType, PropertyType.INTEGER_POSITIVE_NUMBER | PropertyType.NUMBER | PropertyType.POSITIVE_NUMBER>
  }
)

export default function TextBox(props: TextBoxProps) {
    const [state, setState] = useState({ value: String(props.value), prevValue: String(props.value) })
    const propsNumber = props as TextBoxNumberProps
    useEffect(() => {
      let value = props.value === undefined ? props.nullValue : props.value
      
      if (typeof value === 'number'){
        if (propsNumber.min && value < propsNumber.min) props.setValue(String(propsNumber.min));
        if (propsNumber.max && value > propsNumber.max) props.setValue(String(propsNumber.max));
      }
        setState({ prevValue: String(value), value: String(value) })
    }, [props.value, propsNumber.min, propsNumber.max])
    const onChange = (v: string) => {
        if (v === "") { setState({ ...state, value: v }); return }
        const { value, correct } = test(v, props.type)
        if (correct) setState({ ...state, value })
    }
  const className = ((state.value !== state.prevValue) ? "textbox-incorrect" : "textbox")
  const submit = () => {
    if (minMaxTest(state.value, propsNumber.max, propsNumber.min))
      props.setValue(state.value);
    else setState({ ...state, value: state.prevValue });
  }
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit()
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onBlur={() => {
          if (props.submitOnLostFocus && state.value !== state.prevValue) submit(); else setState({ ...state, value: state.prevValue })
        }}
      >
        <input
          type="text"
          style={props.styles || { width: props.width || "auto" }}
          className={className}
          disabled={props.disabled}
          value={state.value}
          maxLength={props.maxLength}
          name={props.name || "input"}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      </form>
    );
}

function test(value: string, type: PropertyType) {
    const regexp = RegExp.get(type) || '';
    const result = { value, correct: false }
    if ((`${value}`.match(regexp) !== null) || value === "") { result.correct = true }
    return result;
}

function minMaxTest(value: string | number, max?: number, min?: number) {
    let result = true
    if (min !== undefined) result = +value >= min
    if (max !== undefined) result = result && (+value <= max)
    return result;
}