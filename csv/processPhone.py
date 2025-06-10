from datetime import datetime, timedelta
import csv
import re
import os

# 起始日期和结束日期
start_date = datetime(2017, 2, 23)
end_date = datetime(2017, 4, 26)
os.makedirs("phone", exist_ok=True)
os.makedirs("phone11", exist_ok=True)
# 使用循环遍历日期范围
current_date = start_date
while current_date <= end_date:
    data = []
    date = current_date.strftime('%Y%m%d')
    date1 = current_date.strftime('%Y-%m-%d')
    print(date)
    with open("data/" + date + ".csv", newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        line = 1
        for row in reader:
            if line != 1:
                item = {'md5': row[0], 'content': re.sub(r'[\x00-\x1F\x7F]', '', row[1].strip()).replace('"', '\'').replace('\\', ''),
                        'dial': row[2], 'connect': row[3], 'receive': row[4],
                        'E': row[5], 'N': row[6]}
                data.append(item)
            line += 1
    phone = {}
    head = {}
    for i in range(0, len(data)):
        item = data[i]
        t = item['connect']
        n = item['dial']
        l = len(n) 
        if l in phone:
            phone[l] = phone[l] + 1
        else:
            phone[l] = 1
        if l == 11:
            ss = n[:3]
            if ss in head:
                head[ss] = head[ss] + 1
            else:
                head[ss] = 1
    with open("phone11/" + date1 + '.csv', mode='w', encoding='utf-8') as f:
        f.write("id,value\n")
        for k in head:
            f.write(date1 + "." + "手机" + k + "," + str(head[k]) + "\n")
        for k in phone:
            f.write(date1 + "." + str(k) + "位号码" + ',' + str(phone[k]) + "\n")
    current_date += timedelta(days=1)  # 日期加一天
