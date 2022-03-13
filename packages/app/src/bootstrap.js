import * as React from "react";
import * as ReactDOM from "react-dom";

import { Button } from "@descript/design-system";

const Index = () => {
  return (
    <div>
      Hello React! <Button />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("app"));
