import { Rating, RoundedStar } from "@smastrom/react-rating";
import { Controller } from "react-hook-form";
import type { NewLogFormInstance } from "../NewLogForm.types";

import "@smastrom/react-rating/style.css";
import { Label } from "~/components/ui/label";

type EnjoymentRatingProps = {
  form: NewLogFormInstance;
};

export const EnjoymentRating = ({ form }: EnjoymentRatingProps) => {
  const { control } = form;
  return (
    <div className="flex flex-col gap-1">
      <Label id="rating_label">Rating</Label>
      <Controller
        control={control}
        name="enjoyment"
        rules={{
          validate: (rating) => (!rating ? true : rating > 0),
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <div className="h-8 w-28">
            <Rating
              value={value ?? 0}
              isRequired
              onChange={onChange}
              visibleLabelId="rating_label"
              onBlur={onBlur}
              itemStyles={{
                itemShapes: RoundedStar,
                activeFillColor: "#f59e0b",
                inactiveFillColor: "#ffedd5",
              }}
            />
          </div>
        )}
      />
    </div>
  );
};
