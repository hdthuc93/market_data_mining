using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.IO;
using System.Collections;
using Excel = Microsoft.Office.Interop.Excel;
using System.Text.RegularExpressions;

namespace _26_1B
{
    class Program
    {
        private const double kmChieuRong = 0.38610;

        public static void Main(string[] args)
        {
            try
            {
                if (args.Length != 2)
                {
                    Console.WriteLine("Tham so dong lenh khong hop le.\nTham so dong lenh hop le: 26_1B.exe @DuongDanDenFileInput @DuongDanLuuFileOutput");
                    return;
                }
                string inputPath = args[0].TrimEnd();
                string outputPath = args[1].TrimEnd();

                if (!File.Exists(inputPath))
                {
                    Console.WriteLine("Tap tin countries.txt khong ton tai. Vui long kiem tra lai");
                    return;
                }
                ValidateOutputPath(outputPath);

                DataTable dtData = InitDataTable();
                dtData = ImportData(dtData, inputPath);
                Console.WriteLine("Chuyen doi dien tich ve km2 thanh cong.");
                dtData = DeleteEmpty(dtData);
                Console.WriteLine("Xoa cac mau rong thanh cong.");
                RemoveDuplicateRows(dtData);
                Console.WriteLine("Xoa cac mau bi trung lap thanh cong.");
                Console.WriteLine("Qua trinh xuat ra file Excel dang thuc hien, vui long cho trong it phut...");
                ExportDataTableToExcel(dtData, outputPath);
                Console.WriteLine("Xuat ra file Excel thanh cong");
                System.Diagnostics.Process.Start(outputPath);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
        }

        private static void ValidateOutputPath(string outputPath)
        {
            try
            {
                FileInfo fOutput = new FileInfo(outputPath);
                if (!fOutput.Directory.Exists)
                {
                    string directory = fOutput.Directory.ToString();
                    Directory.CreateDirectory(directory);

                }
                File.WriteAllText(outputPath, "Write test file");
                File.Delete(outputPath);
            }
            catch
            {
                Console.WriteLine("Duong dan output khong dung, vui long kiem tra lai.");
                return;
            }
        }

        private static double ConvertMi2ToKm2(double input)
        {
            return input / kmChieuRong;
        }

        private static DataTable InitDataTable()
        {
            DataTable dtData = new DataTable("Countries");
            dtData.Columns.Add("country", typeof(long));
            dtData.Columns.Add("name", typeof(string));
            dtData.Columns.Add("longName", typeof(string));
            dtData.Columns.Add("foundingDate", typeof(string));
            dtData.Columns.Add("capital", typeof(string));
            dtData.Columns.Add("largestCity", typeof(string));
            dtData.Columns.Add("population", typeof(long));
            dtData.Columns.Add("area", typeof(double));
            return dtData;
        }

        private static DataTable ImportData(DataTable dt, string inputPath)
        {
            try
            {
                string[] contents = File.ReadAllLines(inputPath);
                int row = -1;
                for (int i = dt.Columns.Count; i < contents.Length - 1; i++)
                {
                    string[] arrLine = contents[i].Split('=');
                    if (arrLine[0] == "country")
                    {
                        row++;
                        long countryId;
                        if (long.TryParse(arrLine[1], out countryId))
                        {
                            DataRow drNew = dt.NewRow();
                            drNew["country"] = countryId;
                            dt.Rows.Add(drNew);
                        }
                    }
                    else
                    {
                        if (arrLine[0].Contains("population"))
                        {
                            long numPopulation;
                            if (long.TryParse(arrLine[1], out numPopulation))
                            {
                                dt.Rows[row][arrLine[0]] = numPopulation;
                                continue;
                            }
                        }
                        if (arrLine[0].Contains("area"))
                        {
                            double valueArea;
                            bool isValid = true;
                            if (arrLine[1].Contains("mi"))
                            {
                                if (double.TryParse(arrLine[1].Replace("mi", ""), out valueArea))
                                {
                                    valueArea = ConvertMi2ToKm2(valueArea);
                                }
                                else
                                {
                                    isValid = false;
                                }
                            }
                            else //km
                            {
                                if (!double.TryParse(arrLine[1].Replace("km", ""), out valueArea))
                                {
                                    isValid = false;
                                }
                            }
                            if (isValid)
                            {
                                dt.Rows[row][arrLine[0]] = valueArea;
                            }
                            continue;
                        }
                        dt.Rows[row][arrLine[0]] = arrLine[1].TrimEnd();
                    }

                }
                return dt;
            }
            catch (Exception e)
            {
                throw e;
            }

        }

        private static DataTable DeleteEmpty(DataTable dt)
        {
            try
            {
                List<DataRow> lstEmptyIndex = new List<DataRow>();
                foreach (DataRow row in dt.Rows)
                {
                    bool isValid = false;
                    foreach (DataColumn col in dt.Columns)
                    {
                        if (col.ColumnName == "country")
                            continue;
                        if (!row[col].ToString().Equals(string.Empty))
                        {
                            isValid = true;
                            break;
                        }
                    }
                    if (!isValid)
                    {
                        lstEmptyIndex.Add(row);
                    }
                }

                foreach (DataRow index in lstEmptyIndex)
                {
                    dt.Rows.Remove(index);
                }
                return dt;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public static DataTable RemoveDuplicateRows(DataTable dTable)
        {
            try
            {
                Hashtable hTable = new Hashtable();
                ArrayList duplicateList = new ArrayList();
                List<int> lstCountryIdDuplicate = new List<int>();
                foreach (DataRow drow in dTable.Rows)
                {
                    string rowKey = drow["name"].ToString() + drow["longName"].ToString() + drow["foundingDate"].ToString() + drow["capital"].ToString() + drow["largestCity"].ToString() + drow["population"].ToString() + drow["area"].ToString();
                    if (hTable.Contains(rowKey))
                    {
                        duplicateList.Add(drow);
                        int countryId = int.Parse(hTable[rowKey].ToString());
                        if (!lstCountryIdDuplicate.Any(p => p == countryId))
                            lstCountryIdDuplicate.Add(countryId);
                    }
                    else
                        hTable.Add(rowKey, drow["country"]);
                }

                foreach (DataRow dRow in duplicateList)
                    dTable.Rows.Remove(dRow);

                foreach (int country in lstCountryIdDuplicate)
                {
                    DataRow r = dTable.AsEnumerable().SingleOrDefault(p => p.Field<long>("country") == country);
                    dTable.Rows.Remove(r);
                }
                return dTable;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public static void ExportDataTableToExcel(DataTable dt, string targetFile)
        {
            try
            {
                Excel.Application excelApp = new Excel.Application();
                excelApp.Workbooks.Add();

                Excel._Worksheet workSheet = excelApp.ActiveSheet;
                workSheet.Name = "Countries";
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    workSheet.Cells[1, (i + 1)] = dt.Columns[i].ColumnName;
                    ((Excel.Range)workSheet.Cells[1, (i + 1)]).Font.Bold = true;
                    ((Excel.Range)(workSheet.Cells[1, i + 1])).Cells.Interior.Color = Excel.XlRgbColor.rgbYellow;
                    ((Excel.Range)(workSheet.Cells[1, i + 1])).Cells.BorderAround2();

                }

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    for (int j = 0; j < dt.Columns.Count; j++)
                    {
                        workSheet.Cells[(i + 2), (j + 1)] = dt.Rows[i][j];
                        ((Excel.Range)(workSheet.Cells[(i + 2), (j + 1)])).Cells.BorderAround2();
                    }
                }

                workSheet.Columns.AutoFit();
                workSheet.SaveAs(targetFile);
                excelApp.Quit();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
        }
    }
}
