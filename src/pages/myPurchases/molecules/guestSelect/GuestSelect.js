import React from "react";

import { Label, Input } from "./GuestSelect.styles";

const GuestSelect = ({ family, onChange, selected }) => (
  <div>
    {family &&
      family.length &&
      family.map(m => (
        <React.Fragment key={m._id}>
          <div>
            <Label>
              <Input
                type="checkbox"
                value={m._id}
                checked={selected && selected.indexOf(m._id) > -1}
                onChange={event => onChange(m._id, event.target.checked)}
              />
              {m.guestFirstName} {m.guestLastName}
            </Label>
          </div>
        </React.Fragment>
      ))}
  </div>
);

export default GuestSelect;
