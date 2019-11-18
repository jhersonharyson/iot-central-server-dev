import sendRespDevice from "../controller/sendRespDevice";
import Device from "../models/device";
import moment from "moment";

const time = 5000;
const tolerance = 45;

export default ({ io }) =>
  setInterval(async () => {
    const varDevice = await sendRespDevice("nothing");

    const device = await Device.find({ status: 1 })
      .select("sensorData")
      .populate({
        path: "sensorData",
        select: "createAt",
        options: {
          limit: 1,
          sort: {
            createAt: -1
          }
        }
      });

    device.map(async arr => {
      if (arr.sensorData[0]) {
        let data = new Date(arr.sensorData[0].createAt);
        let a = moment(data).add(
          tolerance + parseInt(varDevice.sendTime),
          "seconds"
        );
        let der = a.diff(moment(), "seconds");
        if (der < 0) {
          disableDevice(io, arr._id);
        }
      } else {
        disableDevice(io, arr._id);
      }
    });
  }, time);

const disableDevice = async (io, id) => {
  io.emit(
    "updateDevice",
    await Device.findByIdAndUpdate(
      id,
      {
        status: 0
      },
      { useFindAndModify: false }
    )
  );
};
