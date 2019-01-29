import sys

v = sys.stdout
output = open('output.txt', 'w')
f1 = open('device.txt')
f2 = open('time.txt')
f3 = open('message.txt')

sys.stdout = output

out = {
    "1084068111": [],
    "1088217019": [],
    "1084068100": [],
    "1084067241": [],
    "1088214236": [],
    "1084068051": [],
    "1088214034": [],
    "1088214042": [],
    "1088214007": [],
    "1088217018": [],
    "1088214013": []
}

lastTime = {
    "1084068111": "null",
    "1088217019": "null",
    "1084068100": "null",
    "1084067241": "null",
    "1088214236": "null",
    "1084068051": "null",
    "1088214034": "null",
    "1088214042": "null",
    "1088214007": "null",
    "1088217018": "null",
    "1088214013": "null",
}

for i in range(52375):
    val = f1.readline().strip()
    val2 = f2.readline().strip()
    msg = f3.readline().strip()
    if(msg == "Trip End" or msg == "Trip Start"):
        out[val].append(msg + "-----------" + val2)
    #     # if(val not in out):
    #     #     out.update({
        #         val: []
        #     })
        #     out[val].append(msg)
        # else:
        #     out[val].append(msg)
    # if(msg == "StartedMove"):
    #     out[val].append(lastTime[val] + "-------------------" + val2)
    #     lastTime[val] = "null"
        # if(val not in out):
        #     out.update({
        #         val: []
        #     })
        #     out[val].append(lastTime[val] + "-------------------" + val2)
        # else:
        #     out[val].append(lastTime[val] + "-------------------" + val2)
    # if((msg == "NoMove" or msg == "NoMoveTimeout")):
    #     out[val].append("--------" + val2)
    # lastTime[val] = val2
for device in out:
    print(device)
    for time in out[device]:
        print (time)
