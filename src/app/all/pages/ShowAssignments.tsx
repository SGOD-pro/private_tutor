import React,{useState} from "react";
import Popover from "../../components/Popover";

function ShowAssignments() {
    const [show, setShow] = useState<boolean>(true)
    return (
      <>
              <Popover show={show} setShow={setShow}>
                  <div>ShowAssignments</div>
              </Popover>
          </>
    )
}

export default ShowAssignments