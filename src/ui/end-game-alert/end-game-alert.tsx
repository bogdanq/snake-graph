import { Alert, Button } from "antd";
import { useState } from "react";

export function EndGameAlert() {
  const [isShowMore, setShowMore] = useState(false);

  const toggleMore = () => {
    setShowMore((s) => !s);
  };

  return (
    <Alert
      style={{ maxWidth: "700px", marginTop: "30px" }}
      message="Вы проиграли"
      description={
        isShowMore ? (
          <>
            Что бы перемещать карту - нажмите на свободное место и перетащите.
            Для изменения масштаба - необходимо воспользоваться СКМ или ctr+/-
          </>
        ) : (
          <>Доступен просмотр всей игровой области</>
        )
      }
      type="info"
      showIcon
      closable
      action={
        <Button size="small" type="primary" onClick={toggleMore}>
          {isShowMore ? "Скрыть" : "Подробнее"}
        </Button>
      }
    />
  );
}
