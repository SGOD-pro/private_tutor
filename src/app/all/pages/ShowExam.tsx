import React,{useState} from "react";
import Popover from "../../components/Popover";
function ShowExam() {
    const [show, setShow] = useState<boolean>(true)
  return (
    <>
			<Popover show={show} setShow={setShow}>
				<div>ShowExam</div>
			</Popover>
		</>
  )
}

export default ShowExam