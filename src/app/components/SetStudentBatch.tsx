import React, { useEffect, useState } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { AppDispatch } from "@/store/store";
import { showToast } from "@/store/slices/Toast";
import Button from "./Button";
import axios from "axios";
import { useDispatch } from "react-redux";

interface Subject {
  name: string;
  code: string;
}

interface Data {
  [key: string]: Subject[];
}

interface toast {
  summary: string;
  detail: string;
  type: string;
}

function MyForm({
  batchProps,
  subjects,
  closeBtn,
}: {
  batchProps: Data;
  subjects: string[];
  closeBtn: (value: boolean) => void;
}) {
  const [disabled, setDisabled] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<
    { [key: string]: string } | any
  >({});
  const [key, setKey] = useState(0);
  const [data, setData] = useState<any>();
  const addDispatch: AppDispatch = useDispatch();



  const show = ({ summary, detail, type }: toast) => {
    addDispatch(
      showToast({
        severity: type,
        summary,
        detail,
        visible: true,
      })
    );
  };

  const handleChange = (
    e: DropdownChangeEvent,
    subject: string
  ) => {
    const { value } = e;
	console.log("change:",subject,value);
	
    setSelectedSubjects((prevState: any) => ({
      ...prevState,
      [subject.trim()]: value,
    }));
	setKey((prev) => prev + 1);

  };

  const submitEvet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(selectedSubjects);
    const id = localStorage.getItem("id");
    const arr = Object.values(selectedSubjects);
    setDisabled(true);
    axios
      .post(`/api/batches/batch-student?id=${id}`, { batches: arr })
      .then((response) => {
        show({
          type: "success",
          summary: "Success",
          detail: response.data.message,
        });
        localStorage.clear();
      })
      .catch((error) => {
        show({
          type: "error",
          summary: "Success",
          detail: error.response.data.message,
        });
      })
      .finally(() => {
        setDisabled(false);
      });
  };

  useEffect(() => {
    setDisabled(false);
    const id = localStorage.getItem("id");
    if (!id) {
      return;
    }
    axios
      .get(`/api/batches/batch-student?id=${id}`)
      .then((response) => {
        console.log(response);
        
        if (response.data.success) {
          show({
            type: "info",
            summary: "Exists",
            detail: "Already have batches",
          });
          setData(response.data.data);
          setKey((prev) => prev + 1);
        }
      })
      .catch((error) => {
        show({
          type: "error",
          summary: "Fetching",
          detail: error.response.data.message,
        });
        setDisabled(true);
      });
  }, []);

  useEffect(() => {
    const selected:any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        selected[key] = data[key].name;
      }
    }
    setSelectedSubjects(selected);
  }, [data]);

  return (
    <form
      action=""
      className="w-full h-full border rounded-lg p-3 md:p-5 relative"
      onSubmit={submitEvet}
    >
      <div className=" text-right ">
        <i
          className="pi pi-times border p-2 rounded-lg cursor-pointer"
          onClick={() => {
            closeBtn(false);
          }}
        ></i>
      </div>
      <div className="p-grid p-fluid" key={key}>
        {subjects &&
          subjects.map((subject) => (
            <div key={subject} className="p-col-12 p-md-6 p-lg-4">
              <div className="card ">
                <div className="mt-3 md:flex justify-between items-center">
                  <h2 className="text-md capitalize ">{subject}</h2>
                  {batchProps[subject.trim()] ? (
                    <Dropdown
                      value={selectedSubjects[subject.trim()] || null}
                      onChange={(e) => handleChange(e, subject)}
                      options={batchProps[subject.trim()]}
                      optionLabel="code"
                      optionValue="name" // Set optionValue to 'name'
                      className="basis-4/5"
                      placeholder={`Select ${subject}`}
                      disabled={disabled}
                    />
                  ) : (
                    <span>No batches available</span>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <Button disable={disabled} />
    </form>
  );
}

export default MyForm;
