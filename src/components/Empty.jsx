import empty from "../images/empty.svg";

function Empty() {
  return (
    <div>
      <div className="text-center py-2">目前無待辦事項</div>
      <img src={empty} alt="empty" className="mx-auto" />
    </div>
  );
}

export default Empty;
