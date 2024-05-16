interface Batch {
  _id: { $oid: string };
  subject: string;
  days: string[];
}

interface SubjectObject {
  [key: string]: { code: string; name: string }[];
}

const data = {
  subjectWiseBatches: [
    [],
    [
      {
        _id: {
          $oid: "6637ac338283f056bdbe6f81",
        },
        subject: "Java",
        days: ["thrus", "wed"],
        __v: 0,
      },
    ],
    [
      {
        _id: {
          $oid: "66371b89f7bddd9b2d99591a",
        },
        subject: "Next Js",
        days: ["sun", "sat", "wed"],
        __v: 0,
      },
      {
        _id: {
          $oid: "6637ade38283f056bdbe6f9b",
        },
        subject: "Next Js",
        days: ["tue", "thrus"],
        __v: 0,
      },
      {
        _id: {
          $oid: "6637ae068283f056bdbe6f9d",
        },
        subject: "Next Js",
        days: ["mon", "fri"],
        __v: 0,
      },
    ],
  ],
};

function constructObject(data: { subjectWiseBatches: Batch[][] }): SubjectObject {
  const result: SubjectObject = {};

  data.subjectWiseBatches.forEach((batchArray) => {
    batchArray.forEach((batch) => {
      const { _id, subject, days } = batch;
      if (!result[subject]) {
        result[subject] = [];
      }
      result[subject].push({ code: _id.$oid, name: days.join(",") });
    });
  });

  return result;
}

const result = constructObject(data);
console.log(result);
