import { Input, Typography, InputNumber, Slider } from 'antd';
import { useMemo } from 'react';
import { CrossCheckCriteriaData } from 'services/course';

const { TextArea } = Input;
const { Text } = Typography;

interface SubtaskCriteriaProps {
  subtaskData: CrossCheckCriteriaData;
  updateCriteriaData: (updatedEntry: CrossCheckCriteriaData) => void;
}

export default function SubtaskCriteria({ subtaskData, updateCriteriaData }: SubtaskCriteriaProps) {
  const maxScore = subtaskData.max as number;
  const comment = subtaskData.textComment as string;
  const criteriaScore = subtaskData.point as number;

  const updateScore = (event: number) => {
    const updatedEntry = { ...subtaskData, point: event };
    updateCriteriaData(updatedEntry);
  };

  const updateComment = (newComment: string) => {
    const updatedEntry = { ...subtaskData, textComment: newComment };
    updateCriteriaData(updatedEntry);
  };

  const statusCommentRequired = useMemo(() => {
    if (criteriaScore !== undefined) {
      const commentNotMatchRules = comment ? comment.length < 10 : true;
      return criteriaScore < maxScore && commentNotMatchRules;
    }
    return false;
  }, [criteriaScore, comment, maxScore]);

  return (
    <div style={{ border: '1px solid #F5F5F5', margin: '24px 0' }}>
      <div
        style={{
          background: '#FAFAFA',
          borderBottom: '1px solid #F5F5F5',
          padding: '14px 12px',
        }}
      >
        <Text>{subtaskData.text}</Text>
      </div>

      <div
        style={{
          display: 'flex',
          padding: '13px 12px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text>
          Quality of execution:
          <br />
          (Max {maxScore} points for criteria)
        </Text>
        <div style={{ width: '60%', display: 'flex', gap: '10px' }}>
          <Slider style={{ width: '70%' }} min={0} max={maxScore} onChange={updateScore} value={criteriaScore ?? 0} />
          <InputNumber min={0} max={maxScore} value={criteriaScore ?? 0} onChange={updateScore} />
        </div>
      </div>
      <div style={{ padding: '0 12px' }}>
        <TextArea
          style={{ border: statusCommentRequired ? '1px red solid' : '' }}
          value={subtaskData.textComment}
          rows={2}
          onInput={event => updateComment((event.target as HTMLInputElement).value)}
        />
        <div style={{ height: '20px' }}>
          {statusCommentRequired && <Text type="danger">Please leave a detailed comment</Text>}
        </div>
      </div>
    </div>
  );
}
