use clap::{Parser, Subcommand};

/// devtool — a small project maintenance command-line utility.
#[derive(Parser)]
#[command(name = "devtool", version, about = "Project maintenance helper")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Analyze the project for issues.
    Analyze {
        /// Path to analyze.
        #[arg(short, long, default_value = ".")]
        path: String,
    },
    /// Produce a report from the latest analysis.
    Report {
        /// Output format (text or json).
        #[arg(short, long, default_value = "text")]
        format: String,
    },
    /// Remove generated artifacts.
    Clean {
        /// Remove everything, including caches.
        #[arg(long)]
        all: bool,
    },
}

fn run_analyze(path: &str) {
    println!("Analyzing {path} ...");
}

fn run_report(format: &str) {
    println!("Rendering report as {format} ...");
}

fn run_clean(all: bool) {
    if all {
        println!("Cleaning everything ...");
    } else {
        println!("Cleaning build artifacts ...");
    }
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Analyze { path } => run_analyze(&path),
        Commands::Report { format } => run_report(&format),
        Commands::Clean { all } => run_clean(all),
    }
}
