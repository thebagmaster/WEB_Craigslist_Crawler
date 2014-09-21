Imports System
Imports System.IO
Imports System.Diagnostics
Imports System.Net.Mail
Imports System.Xml
Imports System.Timers
Imports System.Text.RegularExpressions
Imports HtmlAgilityPack
Public Class clcrawler

    Dim activeSites As Integer = 17
    Dim myLog As EventLog = New EventLog()
    Dim t As New Timer
    Dim index As Integer
    Dim sites() As String = {
    "http://nashville.craigslist.org/",
    "http://cookeville.craigslist.org/",
    "http://clarksville.craigslist.org/",
    "http://huntsville.craigslist.org/",
    "http://bgky.craigslist.org/",
    "http://chattanooga.craigslist.org/",
    "http://shoals.craigslist.org/",
    "http://westky.craigslist.org/",
    "http://nwga.craigslist.org/",
    "http://gadsden.craigslist.org/",
    "http://jacksontn.craigslist.org/",
    "http://owensboro.craigslist.org/",
    "http://knoxville.craigslist.org/",
    "http://evansville.craigslist.org/",
    "http://bham.craigslist.org/",
    "http://louisville.craigslist.org/",
    "http://lexington.craigslist.org/",
    "tmphttp://atlanta.craigslist.org/",
    "tmphttp://tuscaloosa.craigslist.org/",
    "tmphttp://carbondale.craigslist.org/",
    "tmphttp://northmiss.craigslist.org/",
    "tmphttp://memphis.craigslist.org/",
    "tmphttp://athensga.craigslist.org/",
    "tmphttp://asheville.craigslist.org/",
    "tmphttp://eastky.craigslist.org/",
    "tmphttp://semo.craigslist.org/",
    "tmphttp://bloomington.craigslist.org/",
    "tmphttp://auburn.craigslist.org/",
    "tmphttp://jonesboro.craigslist.org/",
    "tmphttp://tricities.craigslist.org/",
    "tmphttp://greenville.craigslist.org/",
    "tmphttp://montgomery.craigslist.org/",
    "tmphttp://columbusga.craigslist.org/"}
    Dim extention As String = "search/cto?query=toyota&srchType=A&minAsk=2&maxAsk=1300"
    Protected Overrides Sub OnStart(ByVal args() As String)
        ' Add code here to start your service. This method should set things
        ' in motion so your service can do its work
        AddHandler t.Elapsed, AddressOf tick
        '          ms to s   cycletime     num of active cities
        t.Interval = (1000 * 4 * 60 * 60 / activeSites)
        't.Interval = 5000
        t.Start()
        index = 0

        If Not Diagnostics.EventLog.SourceExists("clcrawler") Then
            Diagnostics.EventLog.CreateEventSource("clcrawler", "debug")
        End If
        myLog.Source = "clcrawler"
        myLog.Clear()
        '    myLog.WriteEntry(hd.ToString)
    End Sub

    Protected Overrides Sub OnStop()
        ' Add code here to perform any tear-down necessary to stop your service.
    End Sub

    Sub sendText(ByVal content As String)
        Try
            Dim SmtpServer As New SmtpClient()
            Dim mail As New MailMessage()
            SmtpServer.Credentials = New Net.NetworkCredential("the.craigslist.crawler@gmail.com", "nukit1234")
            SmtpServer.EnableSsl = True
            SmtpServer.Port = 587
            SmtpServer.Host = "smtp.gmail.com"
            mail = New MailMessage()
            mail.From = New MailAddress("the.craigslist.crawler@gmail.com")
            mail.To.Add("the.craigslist.crawler@gmail.com")
            mail.To.Add("9318080953@vzwpix.com")
            mail.To.Add("6156533524@vzwpix.com")
            'mail.To.Add("6152608927@messaging.sprintpcs.com")
            'mail.To.Add("6152608927@pm.sprint.com")
            mail.Subject = ""
            mail.Body = Left(content, 1000)
            SmtpServer.Send(mail)
            myLog.WriteEntry(content + " mail sent")
        Catch ex As Exception
            myLog.WriteEntry(ex.ToString)
        End Try
    End Sub
    Sub tick()
        Try
            Dim hw = New HtmlWeb()
            Dim hd As New HtmlDocument()
            hd = hw.Load(sites(index) + extention)
            Dim list As New List(Of String)
            If (Not System.IO.Directory.Exists(AppDomain.CurrentDomain.BaseDirectory + "\cache\")) Then System.IO.Directory.CreateDirectory(AppDomain.CurrentDomain.BaseDirectory + "\cache\")
            If System.IO.File.Exists(AppDomain.CurrentDomain.BaseDirectory + "\cache\" + index.ToString + ".txt") Then
                Using r As StreamReader = New StreamReader(AppDomain.CurrentDomain.BaseDirectory + "\cache\" + index.ToString + ".txt")
                    Dim line As String
                    line = r.ReadLine
                    Do While (Not line Is Nothing)
                        list.Add(line)
                        line = r.ReadLine
                    Loop
                    r.Close()
                End Using
            End If

            Dim writer As StreamWriter = New StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\cache\" + index.ToString + ".txt", True)
            For Each p As HtmlNode In hd.DocumentNode.SelectNodes("//h4[2]/preceding-sibling::p")
                Dim stringy As String
                stringy = p.SelectSingleNode("a").Attributes.Item("href").Value()
                If Not list.Contains(stringy) And stringy.Substring(0, 14).Equals(sites(index).Substring(0, 14)) Then
                    writer.Write(writer.NewLine() + stringy)
                    'email ppls
                    sendText(p.InnerText.Substring(15).Replace("pic", "").Trim + " " + pullSiteString(stringy))
                End If
            Next
            writer.Close()
            myLog.WriteEntry(sites(index - 1) + " checked")
        Catch Ex As Exception
            myLog.WriteEntry(Ex.ToString)
        End Try
        If index < (activeSites - 1) Then
            index += 1
        Else
            myLog.Clear() 'clear log every 4 hours
            index = 0
        End If
    End Sub
    Function pullSiteString(ByVal url As String)
        Dim returnString As String
        Dim hw = New HtmlWeb()
        Dim hd As New HtmlDocument()
        hd = hw.Load(url)
        Dim p As HtmlNode = hd.DocumentNode.SelectNodes("//div[@id='userbody']")(0)
        returnString = Regex.Match(p.InnerText, "((\(\d{3}\))|(\d{3}-))\d{3}-\d{4}").Value + "  " + url
        returnString += Regex.Replace(p.InnerText, "<[^<>]+>", "")
        Return (returnString)
    End Function
    Public Function Left(ByVal Value As String, ByVal Length As Integer) As String
        If Value.Length >= Length Then
            Return Value.SubString(0, Length)
        Else
            Return Value
        End If
    End Function
End Class
