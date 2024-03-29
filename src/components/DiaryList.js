import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiaryButton from './DiaryButton';
import DiaryItem from './DiaryItem';

const sortOptionList = [
  { value: 'latest', name: '최신순' },
  { value: 'oldest', name: '오래된순' },
];

const filterOptionList = [
  { value: 'all', name: '모든 감정' },
  { value: 'good', name: '좋은 감정' },
  { value: 'bad', name: '안좋은 감정' },
];

const ControlMenu = React.memo(({ value, onChange, optionList }) => {
  return (
    <select
      className="ControlMenu"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {optionList.map((it, idx) => (
        <option key={idx} value={it.value}>
          {it.name}
        </option>
      ))}
    </select>
  );
});

const DiaryList = ({ diaryList }) => {
  const navigate = useNavigate();

  // 정렬기능
  const [sortType, setSortType] = useState('latest');
  const [filter, setFilter] = useState('all');
  const [numOfList, setNumberOfList] = useState(0);

  useEffect(() => {
    setNumberOfList(diaryList.length);
  });

  const getProcessdDiaryList = () => {
    const filterCallback = (item) => {
      if (filter === 'good') {
        return parseInt(item.emotion) <= 3;
      } else {
        return parseInt(item.emotion) > 3;
      }
    };

    // sort를 위한 비교 함수
    const compare = (a, b) => {
      if (sortType === 'latest') {
        // 문자열이 들어올 수 있기에 형 변환
        return parseInt(b.date) - parseInt(a.date);
      } else {
        return parseInt(a.date) - parseInt(b.date);
      }
    };

    // diaryList deep copy
    const copyList = JSON.parse(JSON.stringify(diaryList));
    const filteredList =
      filter === 'all' ? copyList : copyList.filter((it) => filterCallback(it));

    const sortedList = filteredList.sort(compare);

    return sortedList;
  };

  return (
    <div className="DiaryList">
      <div className="menu_wrapper">
        <div className="left_col">
          <ControlMenu
            value={sortType}
            onChange={setSortType}
            optionList={sortOptionList}
          />
          <ControlMenu
            value={filter}
            onChange={setFilter}
            optionList={filterOptionList}
          />
        </div>

        <div className="right_col">
          <DiaryButton
            type={'positive'}
            text={'새 일기 작성'}
            onClick={() => navigate('/new')}
          />
        </div>
      </div>

      <section>
        {numOfList > 0 ? (
          getProcessdDiaryList().map((it) => <DiaryItem key={it.id} {...it} />)
        ) : (
          <p className="nolist">첫 일기를 작성해보세요</p>
        )}
      </section>
    </div>
  );
};

DiaryList.defaultProps = {
  diaryList: [],
};

export default DiaryList;
