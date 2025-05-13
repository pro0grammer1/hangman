'use client';

export const WordDisplay = ({
  wordArr,
  wordCount
}: {
  wordArr: (string | '_' | ' ')[];
  wordCount: string[];
}) => (
  <div>
    <h1 className="text-xl text-center font-bold text-black">
      {wordArr.map((c, i) => (
        <span className="mr-4" key={i}>
          {c === ' ' ? ' ' : c === '_' ? '_' : c}
        </span>
      ))}
    </h1>
    <div className="flex justify-around text-xl sm:text-2xl font-bold text-black">
      {wordCount.map((c, i) => (
        <span key={i} className="flex justify-center" style={{ width: `${c.length * 2 - 1}ch` }}>
          {c.length}
        </span>
      ))}
    </div>
  </div>
);