import { Button, Form, InputNumber, Select, Input, message } from 'antd';
import { TaskType } from 'modules/CrossCheck/components/CrossCheckCriteriaForm';
import React, { useMemo, useState } from 'react';
import { CrossCheckCriteriaType, IAddCriteriaForCrossCheck } from 'services/course';

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

export const AddCriteriaForCrossCheck = ({ onCreate }: IAddCriteriaForCrossCheck) => {
  const [type, setType] = useState<CrossCheckCriteriaType>('title');
  const [max, setMax] = useState(0);
  const [maxPenalty, setMaxPenalty] = useState(0);
  const [text, setText] = useState('');
  const DEFAULT_KEY = '0';
  const DEFAULT_INDEX = 0;

  const clearInputs = () => {
    setMax(0);
    setMaxPenalty(0);
    setText('');
  };

  const onFinish = () => {
    let criteriaDetails;
    type.toLowerCase() === TaskType.Title
      ? (criteriaDetails = {
          key: DEFAULT_KEY,
          text: text,
          type: type,
          index: DEFAULT_INDEX,
        })
      : (criteriaDetails = {
          key: DEFAULT_KEY,
          max: type.toLowerCase() === TaskType.Penalty ? -Math.abs(maxPenalty) : max,
          text: text,
          type: type,
          index: DEFAULT_INDEX,
        });
    clearInputs();
    onCreate(criteriaDetails);
    message.success('Criteria added!');
  };

  function changeMax(value: number) {
    setMax(value);
  }

  function changeMaxPenalty(value: number) {
    setMaxPenalty(value);
  }

  function changeType(value: CrossCheckCriteriaType) {
    setType(value);
  }

  const isDisabled: boolean = useMemo(() => {
    if (type.toLocaleLowerCase() === TaskType.Title) {
      return text ? false : true;
    }
    if (type.toLocaleLowerCase() === TaskType.Penalty) {
      return text && maxPenalty ? false : true;
    }
    return text && max ? false : true;
  }, [type, max, maxPenalty, text]);

  return (
    <>
      <Item label="Criteria Type">
        <Select placeholder="Select type" onChange={changeType}>
          <Option data-testid="Title" value="Title">
            Title
          </Option>
          <Option data-testid="Subtask" value="Subtask">
            Subtask
          </Option>
          <Option value="Penalty">Penalty</Option>
        </Select>
      </Item>

      {type.toLowerCase() === TaskType.Subtask ? (
        <Item label="Add Max Score">
          <InputNumber value={max} min={0} step={1} onChange={changeMax} />
        </Item>
      ) : type.toLowerCase() === TaskType.Penalty ? (
        <Item label="Add Max Penalty">
          <InputNumber value={maxPenalty} step={1} onChange={changeMaxPenalty} />
        </Item>
      ) : null}

      <Item label="Add Text">
        <TextArea
          rows={3}
          style={{ maxWidth: 1200 }}
          placeholder="Add description"
          value={text}
          onChange={e => setText(e.target.value)}
        ></TextArea>
      </Item>

      <div style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={onFinish} disabled={isDisabled}>
          Add New Criteria
        </Button>
      </div>
    </>
  );
};
